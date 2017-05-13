package hfx.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import hfx.model.FileInfo;
import hfx.model.HotfixInfo;
import hfx.model.HotfixSearchParameters;
import hfx.model.HotfixTrackingDocument;

@Service
public class SystemFileHotfixServices {

	private static final Logger LOGGER = LoggerFactory.getLogger(SystemFileHotfixServices.class);

	@Value("${hfx.hotfix-location}")
	private String hotfixLocation;

	@Value("${hfx.tracking-doc-location}")
	private String trackingDocumentLocation;
	
	@Autowired(required = true)
	private DependencyResolver arCollectionDependencyResolver;

	@Autowired
	private SystemFileHotfixServices systemFileHotfixServices;

	public static String HOTFIX_ROOT_DIR(String rootPath, int version) {
		return rootPath + version;
	}

	public static String HOTFIX_DIR(String rootPath, int version, int hfID) {
		return HOTFIX_ROOT_DIR(rootPath, version) + "/" + "HF_" + hfID;
	}

	public static String FILE_PATH(String rootPath, int version, int hfID, String filename) {
		return HOTFIX_DIR(rootPath, version, hfID) + "/" + filename;
	}

	public static String README_FILE_PATH(String rootPath, int version, int hfID) {
		return FILE_PATH(rootPath, version, hfID, "HF_" + hfID + ".README.txt");
	}

	public static String TRACKING_DOC_DIR(String rootPath, int version) {
		return rootPath + "/" + version;
	}

	public static String TRACKING_DOC_FILE_PATH(String rootPath, int version, String fileID) {
		return rootPath + "/" + version + "/" + fileID + ".json";
	}

	@CacheEvict(cacheNames = "FileInfoSet", key = "#HFID")
	public void refreshFileInfoSet(int HFID) {
		LOGGER.debug("Remove FileInfoSet " + HFID + " from cache");
	}

	@Cacheable(cacheNames = "FileInfoSet", key = "#HFID")
	public List<FileInfo> getFileInfo(int HFID, int version) {
		LOGGER.debug("getFileInfo : " + HFID);
		List<FileInfo> fs = new ArrayList<FileInfo>();
		File dir = new File(SystemFileHotfixServices.HOTFIX_DIR(hotfixLocation, version, HFID));
		for (File f : dir.listFiles()) {
			if (f.isFile()) {
				fs.add(new FileInfo(f));
			}
		}
		return fs;
	}

	@CacheEvict(cacheNames = "HotfixInfo", key = "#HFID")
	public void refreshHotfixInfo(int HFID) {
		LOGGER.debug("Remove HotfixInfo " + HFID + " from cache");
	}
	
	@Cacheable(cacheNames = "HotfixInfo", key = "#HFID")
	public HotfixInfo getHotfixInfo(int HFID, int version) {
		String hotfixCreator = null;
		Date creationDate = null;
		StringBuilder instructions = new StringBuilder();
		String defectSummary = null;
		List<String> files = new ArrayList<String>();
		String module = null;
		try {
			List<String> lines = FileUtils.readLines(new File(README_FILE_PATH(hotfixLocation, version, HFID)), "UTF-8");
			for (int i=0; i<lines.size(); i++) {
				String line = lines.get(i);
				if (line.contains("Created by:")) {
					hotfixCreator = line.split(":", 2)[1].trim();
				} else if (line.contains("Created on:")) {
					String creationDateStr = line.split(":", 2)[1].trim();
					creationDate = HotfixInfo.parseDate(creationDateStr);
				} else if (line.contains("Instructions:")) {
					instructions.append(line.split(":", 2)[1]).append("\n");
					for (i++;i<lines.size();i++) {
						String instructionLine = lines.get(i);
						if (instructionLine.contains("Defects:")) {
							break;
						}
						instructions.append(instructionLine).append("\n");
					}
				} else if (line.contains("QC_NAME, DEFECT_NUMBER")) {
					i++;i++;
					defectSummary = lines.get(i);
					LOGGER.debug("defectSummary : " + defectSummary);
				} else if (line.contains("FILE_NAME, FILE_DATE")) {
					for (i++,i++;i<lines.size();i++) {
						String fileLine = lines.get(i);
						if (fileLine.contains("Additional Parameters:")) {
							break;
						}
						String[] fileColumns = fileLine.split(",", 2);
						if (fileColumns.length > 1) {
							files.add(fileColumns[0]);
						}
					}
					
				} else if (line.contains("Application Name,")) {
					module = line.split(",",2)[1].trim();
				}
			}
			
			HotfixInfo hf = new HotfixInfo(HFID, version, hotfixCreator, defectSummary, module, creationDate);
			hf.setInstruction(instructions.toString());
			hf.setFiles(StringUtils.collectionToCommaDelimitedString(files));
			hf.setLocation(HOTFIX_DIR(hotfixLocation, version, HFID));
			return hf;
		} catch (IOException e) {
			throw new RuntimeException("Error while parsing README file for hotfix info : " + e.getMessage(), e);
		}
	}
	
	@Cacheable(cacheNames = "HotfixInfo", key = "#HFID")
	public HotfixInfo _getHotfixInfo(int HFID, int version) {
		Scanner sc = null;
		try {
			File f = new File(README_FILE_PATH(hotfixLocation, version, HFID));
			LOGGER.debug("getHotfixInfo : " + f.getPath());

			sc = new Scanner(f);
			if (sc.findWithinHorizon("Created by:", 0) == null) {
				throw new RuntimeException("Cannot find element 'Created by:' in the file : " + f.getPath());
			}
			String hotfixCreator = sc.nextLine().trim();

			// "Created on: 01-Dec-2016 19:10:26"
			if (sc.findWithinHorizon("Created on:", 0) == null) {
				throw new RuntimeException("Cannot find element 'Created on:' in the file : " + f.getPath());
			}
			String creationDateStr = sc.nextLine().trim();
			Date creationDate = HotfixInfo.parseDate(creationDateStr);

			if (sc.findWithinHorizon("Instructions:", 0) == null) {
				throw new RuntimeException("Cannot find element 'Instructions:' in the file : " + f.getPath());
			}
			
			String instructions = sc.findWithinHorizon("Defects:", 0);
			if ( instructions == null) {
				throw new RuntimeException("Cannot find element 'Defects:' in the file : " + f.getPath());
			}
			
			
			if (sc.findWithinHorizon("QC_NAME, DEFECT_NUMBER", 0) == null) {
				throw new RuntimeException("Cannot find element 'QC_NAME, DEFECT_NUMBER' in the file : " + f.getPath());
			}
			sc.nextLine();
			sc.nextLine();
			String defectSummary = sc.nextLine().trim();
			
			if (sc.findWithinHorizon("FILE_NAME, FILE_DATE", 0) == null) {
				throw new RuntimeException("Cannot find element 'FILE_NAME, FILE_DATE' in the file : " + f.getPath());
			}
			sc.nextLine();
			sc.nextLine();
			String fileList = sc.findWithinHorizon("Additional Parameters:", 0);
			if (fileList == null) {
				throw new RuntimeException("Cannot find element 'Additional Parameters:' in the file : " + f.getPath());
			}
			
			List<String> files = new ArrayList<String>();
			
			for (String line : fileList.split("\n")) {
				String[] column = line.split(",");
				if (column.length > 2) {
					files.add(column[0]);
				}
			}
			
			if (sc.findWithinHorizon("Application Name,", 0) == null) {
				throw new RuntimeException("Cannot find element 'Application Name,' in the file : " + f.getPath());
			}
			String module = sc.nextLine().trim();

			HotfixInfo hf = new HotfixInfo(HFID, version, hotfixCreator, defectSummary, module, creationDate);
			hf.setInstruction(instructions);
//			hf.setFiles(files);
			hf.setLocation(HOTFIX_DIR(hotfixLocation, version, HFID));
			return hf;
		} catch (Exception e) {
			throw new RuntimeException("Error while parsing README file for hotfix info : " + e.getMessage(), e);
		} finally {
			if (sc != null) {
				sc.close();
			}
		}
	}

	public List<Integer> analizeDependencyARCollection(List<Integer> hfs, int version) {
		if (hfs.size() == 0) {
			throw new RuntimeException("No hotfix to analize.");
		} else if (hfs.size() == 1) {
			// every hotfix depends on itself.
			return hfs;
		}

		List<Integer> result = new ArrayList<Integer>();
		result.add(hfs.get(0));
		List<FileInfo> root = systemFileHotfixServices.getFileInfo(hfs.get(0), version);

		for (int i = 1; i < hfs.size(); i++) {
			Integer HFID = hfs.get(i);
			List<FileInfo> next = systemFileHotfixServices.getFileInfo(HFID, version);
			if (arCollectionDependencyResolver.isDependent(root, next)) {
				result.add(HFID);
				arCollectionDependencyResolver.mergeFileSets(root, next);
			}
		}

		return result;
	}

	public List<String> getTrackingDocumentList(int version) {
		File dir = new File(TRACKING_DOC_DIR(trackingDocumentLocation, version));
		List<String> result = new ArrayList<String>();
		for (File f : dir.listFiles()) {
			String item = new File(TRACKING_DOC_DIR(trackingDocumentLocation, version)).toURI().relativize(f.toURI())
					.getPath();
			result.add(FilenameUtils.removeExtension(item));
		}
		return result;
	}

	public Map<Integer, List<String>> getAllTrackingDocument() {
		File dir = new File(trackingDocumentLocation);
		Map<Integer, List<String>> result = new HashMap<Integer, List<String>>();
		for (File pathVersion : dir.listFiles()) {
			if (pathVersion.isDirectory()) {
				try {
					int version = Integer.parseInt(pathVersion.getName());
					List<String> docList = getTrackingDocumentList(version);
					result.put(version, docList);
				} catch (NumberFormatException e) {
					LOGGER.info("Skip dir because it is not in a valid format: " + e.getMessage());
				}
			}
		}
		return result;
	}

	public HotfixTrackingDocument getTrackingDocument(int version, String documentID) throws FileNotFoundException {
		ObjectMapper mapper = new ObjectMapper();
		HotfixTrackingDocument doc;
		try {
			doc = mapper.readValue(
					FileUtils.readFileToByteArray(
							new File(TRACKING_DOC_FILE_PATH(trackingDocumentLocation, version, documentID))),
					HotfixTrackingDocument.class);
		}  catch (FileNotFoundException e) {
			throw e;
		} catch (IOException e) {
			throw new RuntimeException("Error while parsing tracking document : " + e.getMessage(), e);
		}
		return doc;
	}

	public void saveTrackingDocument(HotfixTrackingDocument doc) {
		File dir = new File(TRACKING_DOC_DIR(trackingDocumentLocation, doc.getVersion()));
		ObjectMapper mapper = new ObjectMapper();
		ObjectWriter writer = mapper.writer();
		try {
			FileUtils.forceMkdir(dir);
			writer.writeValue(new File(TRACKING_DOC_FILE_PATH(trackingDocumentLocation, doc.getVersion(), doc.getDocumentID())), doc);
		} catch (IOException e) {
			throw new RuntimeException("Error while writing tracking document to file : " + e.getMessage(), e);
		}
	}

	public List<Integer> getAllHotfixID(int version) {
		File dir = new File(HOTFIX_ROOT_DIR(hotfixLocation, version));
		File[] fileList = dir.listFiles();
		if (fileList == null) {
			throw new RuntimeException("Invalid hotfix path: " + dir.getAbsolutePath());
		}
		List<Integer> result = new ArrayList<Integer>();
		for (File hfDir : fileList) {
			if (hfDir.isDirectory()) {
				String baseName = FilenameUtils.getBaseName(hfDir.getPath());
				if (baseName.startsWith("HF_") && baseName.length() == 12) {
					for (File f : hfDir.listFiles()) {
						String fileName = f.getName();
						if (f.isFile() && fileName.startsWith("HF_") && fileName.endsWith("README.txt")) {
							try {
								result.add(Integer.parseInt(fileName.substring(3, 12)));	
							} catch (NumberFormatException e) {
								// Ignore it
							}
						}
					}
				}
			}
		}
		return result;
	}

	public List<HotfixInfo> searchHotfix(int version, HotfixSearchParameters searchParams) {
		List<HotfixInfo> result = new ArrayList<HotfixInfo>();
		for (Integer hfid : systemFileHotfixServices.getAllHotfixID(version)) {
			HotfixInfo hf = systemFileHotfixServices.getHotfixInfo(hfid, version);
			if (this.matchHFCondition(hf, searchParams)) {
				result.add(hf);
			}
		}
		return result;
	}

	private boolean matchHFCondition(HotfixInfo hf, HotfixSearchParameters searchParams) {
		List<String> moduleList = searchParams.getModule();
		List<String> moduelListUpper = new ArrayList<String>();
		if (moduleList != null) {
			for (String m : moduleList) {
				moduelListUpper.add(m.toUpperCase());
			}
		}
		
		Integer HFIDAfter = searchParams.getHFIDAfter();
		String filenameKeyword = searchParams.getFilenameKeyword();
		String dfSummaryKeyword = searchParams.getDfSummaryKeyword();
		Boolean includeTrueHF = searchParams.getIncludeTrueHF();
		Boolean includeAmdocsHF = searchParams.getIncludeAmdocsHF();

		if (!moduelListUpper.isEmpty() && !moduelListUpper.contains(hf.getModule().toUpperCase())) {
			return false;
		}
		if (dfSummaryKeyword != null && !hf.getDefectSummary().toUpperCase().contains(dfSummaryKeyword.toUpperCase())) {
			return false;
		}

		if (includeTrueHF != null && !includeTrueHF && (String.valueOf(hf.getHFID()).startsWith("5"))) {
			return false;
		}
		if (includeAmdocsHF != null && !includeAmdocsHF && (String.valueOf(hf.getHFID()).startsWith("1"))) {
			return false;
		}
		if (filenameKeyword != null && !systemFileHotfixServices.containFileNameLike(hf, filenameKeyword)) {
			return false;
		}
		if (HFIDAfter != null) {
			HotfixInfo hfx = systemFileHotfixServices.getHotfixInfo(HFIDAfter, hf.getVersion());
			if (!hf.getCreationDate().after(hfx.getCreationDate())) {
				return false;
			}
		}

		return true;
	}

	private boolean containFileNameLike(HotfixInfo hf, String keyword) {
		List<FileInfo> fileSet = systemFileHotfixServices.getFileInfo(hf.getHFID(), hf.getVersion());
		for (FileInfo f : fileSet) {
			if (f.getFileName().toUpperCase().contains(keyword.toUpperCase())) {
				return true;
			}
		}
		return false;
	}

	public String getReadMeContent(int HFID, int version) {
		File readMeFile = new File(README_FILE_PATH(hotfixLocation, version, HFID));
		return getFileContent(readMeFile);
	}
	
	public String getFileContent(File file) {
		try {
			return FileUtils.readFileToString(file, "UTF-8");
		} catch (IOException e) {
			throw new RuntimeException("Error while getting file content: " + e.getMessage(), e);
		}
	}
}
