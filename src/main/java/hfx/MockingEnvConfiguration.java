package hfx;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.jar.Attributes;
import java.util.jar.JarEntry;
import java.util.jar.JarOutputStream;
import java.util.jar.Manifest;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import hfx.model.FileInfo;
import hfx.model.HotfixInfo;
import hfx.model.HotfixTrackingDocument;
import hfx.service.SystemFileHotfixServices;

@Configuration
@Profile("dev")
public class MockingEnvConfiguration {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(MockingEnvConfiguration.class);

	@Value("${hfx.hotfix-location}")
	private String hotfixLocation;
	
	@Value("${hfx.tracking-doc-location}")
	private String trackingDocLocation;
	
	@Value("${hfx.resource-location}")
	private String resourceLocation;
	
	@PreDestroy
	void shutdown() throws IOException {
		MockData mockData = mockData();
		FileUtils.deleteDirectory(new File(SystemFileHotfixServices.HOTFIX_ROOT_DIR(hotfixLocation, mockData.VERSION)));
		FileUtils.deleteDirectory(new File(SystemFileHotfixServices.TRACKING_DOC_DIR(trackingDocLocation, mockData.VERSION)));
		FileUtils.deleteDirectory(new File(resourceLocation));
	}

	@PostConstruct
	void init() throws IOException {
		LOGGER.debug("Create mock hotfix data in : " + hotfixLocation);
		MockData mockData = mockData();
		FileUtils.forceMkdir(new File(SystemFileHotfixServices.HOTFIX_ROOT_DIR(hotfixLocation, mockData.VERSION)));
		FileUtils.forceMkdir(new File(SystemFileHotfixServices.TRACKING_DOC_DIR(trackingDocLocation, mockData.VERSION)));	
		FileUtils.forceMkdir(new File(resourceLocation));
		createMockHotfixReadMe(mockData.mockHF1);
		createMockHotfixFileSet(mockData.mockHF1FileSet);
		createMockHotfixReadMe(mockData.mockHF2);
		createMockHotfixFileSet(mockData.mockHF2FileSet);
		createMockHotfixReadMe(mockData.mockHF3);
		createMockHotfixFileSet(mockData.mockHF3FileSet);
		createMockHotfixReadMe(mockData.mockHF4);
		createMockHotfixFileSet(mockData.mockHF4FileSet);
		createMockHotfixReadMe(mockData.mockHF5);
		createMockHotfixFileSet(mockData.mockHF5FileSet);
		createMockHotfixReadMe(mockData.mockHF6);
		createMockHotfixFileSet(mockData.mockHF6FileSet);
		
		createMockHotfixReadMe(mockData.mockHF7);
		createMockHotfixReadMe(mockData.mockHF8);
		createMockHotfixReadMe(mockData.mockHF9);
		createMockHotfixReadMe(mockData.mockHF10);
		
		LOGGER.debug("Create mock tracking doc in : " + trackingDocLocation);
		
		createMockTrackingDoc(mockData.mockTrackingDocAR763);
		createMockTrackingDoc(mockData.mockTrackingDocCollection763);
		
	}
	
	private void createMockTrackingDoc(HotfixTrackingDocument doc) {
		ObjectMapper mapper = new ObjectMapper();
		ObjectWriter writer = mapper.writer();
		try {
			writer.writeValue(new File(SystemFileHotfixServices.TRACKING_DOC_FILE_PATH(trackingDocLocation, doc.getVersion(), doc.getDocumentID())), doc);
		} catch (IOException e) {
			throw new RuntimeException("Error while writing tracking document to file : " + e.getMessage(), e);
		}
	}
	
	private void createMockHotfixReadMe(HotfixInfo hf) throws IOException {
		File dir = new File(SystemFileHotfixServices.HOTFIX_DIR(hotfixLocation, hf.getVersion(), hf.getHFID()));
		FileUtils.forceMkdir(dir);
		File f = new File(SystemFileHotfixServices.README_FILE_PATH(hotfixLocation, hf.getVersion(), hf.getHFID()));
		PrintWriter pw = null;
		
		try {
			pw = new PrintWriter(new FileOutputStream(f));
			pw.println("Hot-fix Number:" + hf.getHFID());
			pw.println("Created by:" + hf.getCreator());
			pw.println("Created on:" + HotfixInfo.formatDate(hf.getCreationDate()));
			pw.println("Release:" + hf.getVersion());
			pw.println("Instructions: 1. Place below files under  pbin/app and make sure that it has execute permission");
			pw.println("gl1_JrnlAnalysis_Process_Sh");
			pw.println("3. Apply DF111_New_OP_APP_DESC_and_OP_APP_DATA.sql on operational DB");
			pw.println("4. Start WL -g ear");
			pw.println("Defects:");
			pw.println("QC_NAME, DEFECT_NUMBER, DETECTED_BUILD, DETECTED_VERSION, HF_REQUIRED, HF_STATUS, DEFECT_SUMMARY");
			pw.println("-------, -------------, --------------, ----------------, -----------, ---------, --------------");
			pw.println(hf.getDefectSummary());
			pw.println("FILE_NAME, FILE_DATE, FILE_SIZE, FILE_PERMISSIONS, FILE_CHKSUM");
			pw.println("---------, ---------, ---------, ----------------, -----------");
			pw.println("ar9_gl_dwh_data_sh,21-Apr-2017 16:15:15,41273,-rwxr-xr-x,513d0a28f430c698cda4075e4ddd511b");
			pw.println("ar1_JrnlExtract_Process_Sh,18-Apr-2017 09:33:43,2475,-rwxr-xr-x,8f2d4ac751655568552d249fecc054ea");
			pw.println("ar1_JrnlExtract_Sh,18-Apr-2017 09:33:42,4136,-rwxr-xr-x,1ac486ee0edb62c9e8e6aec910c9f5d2");
			pw.println("gl1_GLAccum_Process_Sh,18-Apr-2017 09:33:42,2439,-rwxr-xr-x,e7ea31d5b45904d7b522f6fb272a9b4c");
			pw.println("Additional Parameters:");
			pw.println("NAME, VALUE");
			pw.println("----, -----");
			pw.println("Application Name," + hf.getModule());
			
		} finally {
			if (pw != null) {
				pw.close();
			}
		}
	}
	
	private static void createMockHotfixFileSet(List<FileInfo> mockHF1FileSet) throws IOException {
		for (FileInfo file : mockHF1FileSet) {
			File f = new File(file.getFilePath());
			FileOutputStream out = null;
			JarOutputStream jarOut = null;
			BufferedInputStream in = null;
			try {
				out = new FileOutputStream(f);
				if (f.getName().endsWith(".jar")) {
					Manifest manifest = new Manifest();
					manifest.getMainAttributes().put(Attributes.Name.MANIFEST_VERSION, "1.0");
					jarOut = new JarOutputStream(out, manifest);
					for (int i = 0; i <= 5; i++) {
						String jarName = f.getName().split("\\.")[0];
						JarEntry e = new JarEntry("pack1/pack2/" + jarName + "_" + i + ".class");
						jarOut.putNextEntry(e);
						jarOut.closeEntry();
					}
				} else {
					FileUtils.write(f, file.getFileName(), "UTF-8");
				}
				
			} finally {
				if (jarOut != null) {
					try {
						jarOut.close();
					} catch (IOException e) {
						// avoid throwing Exception inside finally block because it will discard the actual Exception
						LOGGER.error("Error while closing JarOutputStream", e);
					}
				}
				if (out != null) {
					out.close();
				}
				if (in != null) {
					in.close();
				}
			}
		}
	}
	
	@Bean
	public MockData mockData() {
		return new MockData();
	}
	
	public class MockData {
		public final int VERSION = 763;
		
		public final HotfixInfo mockHF1 = new HotfixInfo(100000001, VERSION, "John", "6001, Some Bug1", "AR", HotfixInfo.parseDate("01-Dec-2016 19:10:26"));
		public final List<FileInfo> mockHF1FileSet = new ArrayList<FileInfo>(Arrays.asList(
				new FileInfo(SystemFileHotfixServices.FILE_PATH(hotfixLocation, VERSION, mockHF1.getHFID(), "A1.class")),
				new FileInfo(SystemFileHotfixServices.FILE_PATH(hotfixLocation, VERSION, mockHF1.getHFID(), "A2.class")),
				new FileInfo(SystemFileHotfixServices.FILE_PATH(hotfixLocation, VERSION, mockHF1.getHFID(), "J1_1.class"))
				));
		
		public final HotfixInfo mockHF2 = new HotfixInfo(100000002, VERSION, "John", "6002, Some Bug2", "AR", HotfixInfo.parseDate("02-Dec-2016 19:10:26"));
		public final List<FileInfo> mockHF2FileSet = new ArrayList<FileInfo>(Arrays.asList(
				new FileInfo(SystemFileHotfixServices.FILE_PATH(hotfixLocation, VERSION, mockHF2.getHFID(), "B1.class")),
				new FileInfo(SystemFileHotfixServices.FILE_PATH(hotfixLocation, VERSION, mockHF2.getHFID(), "B1.class")),
				new FileInfo(SystemFileHotfixServices.FILE_PATH(hotfixLocation, VERSION, mockHF2.getHFID(), "J2_1.class"))
				));
		
		public final HotfixInfo mockHF3 = new HotfixInfo(100000003, VERSION, "John", "6003, Some Bug3", "AR", HotfixInfo.parseDate("03-Dec-2016 19:10:26"));
		public final List<FileInfo> mockHF3FileSet = new ArrayList<FileInfo>(Arrays.asList(
				new FileInfo(SystemFileHotfixServices.FILE_PATH(hotfixLocation, VERSION, mockHF3.getHFID(), "A1.class")),
				new FileInfo(SystemFileHotfixServices.FILE_PATH(hotfixLocation, VERSION, mockHF3.getHFID(), "A3.class")),
				new FileInfo(SystemFileHotfixServices.FILE_PATH(hotfixLocation, VERSION, mockHF3.getHFID(), "J1_2.class"))
				));
		
		public final HotfixInfo mockHF4 = new HotfixInfo(100000004, VERSION, "John", "6004, Some Bug4", "AR", HotfixInfo.parseDate("04-Dec-2016 19:10:26"));
		public final List<FileInfo> mockHF4FileSet = new ArrayList<FileInfo>(Arrays.asList(
				new FileInfo(SystemFileHotfixServices.FILE_PATH(hotfixLocation, VERSION, mockHF4.getHFID(), "C1.class"))
				));
		
		public final HotfixInfo mockHF5 = new HotfixInfo(100000005, VERSION, "John", "6005, Some Bug5", "AR", HotfixInfo.parseDate("05-Dec-2016 19:10:26"));
		public final List<FileInfo> mockHF5FileSet = new ArrayList<FileInfo>(Arrays.asList(
				new FileInfo(SystemFileHotfixServices.FILE_PATH(hotfixLocation, VERSION, mockHF5.getHFID(), "J1.jar"))
				));
		
		public final HotfixInfo mockHF6 = new HotfixInfo(100000006, VERSION, "John", "6006, Some Bug6", "AR", HotfixInfo.parseDate("06-Dec-2016 19:10:26"))
				.addDependency(100000006, "SELF")
				.addDependency(mockHF5.getHFID(), "UNRESOLVED")
				.addDependency(mockHF3.getHFID(), "UNRESOLVED")
				.addDependency(mockHF1.getHFID(), "UNRESOLVED");
		
		public final List<FileInfo> mockHF6FileSet = new ArrayList<FileInfo>(Arrays.asList(
				new FileInfo(SystemFileHotfixServices.FILE_PATH(hotfixLocation, VERSION, mockHF6.getHFID(), "J2.jar"))
				));
		
		public final HotfixInfo mockHF7 = new HotfixInfo(100000007, VERSION, "John", "6007, Some Bug7", "Collection", HotfixInfo.parseDate("07-Dec-2016 19:10:26"));
		public final HotfixInfo mockHF8 = new HotfixInfo(100000008, VERSION, "John", "6008, Some Bug8", "Collection", HotfixInfo.parseDate("08-Dec-2016 19:10:26"));
		public final HotfixInfo mockHF9 = new HotfixInfo(100000009, VERSION, "John", "6009, Some Foo9", "Collection", HotfixInfo.parseDate("09-Dec-2016 19:10:26"));
		public final HotfixInfo mockHF10 = new HotfixInfo(100000010, VERSION, "John", "6010, Some Bug10", "AR", HotfixInfo.parseDate("10-Dec-2016 19:10:26"));
		public final HotfixTrackingDocument mockTrackingDocAR763 = new HotfixTrackingDocument("tracking_ar_763", VERSION)
				.addHotfixInfo(mockHF1)
				.addHotfixInfo(mockHF2)
				.addHotfixInfo(mockHF3)
				.addHotfixInfo(mockHF4)
				.addHotfixInfo(mockHF5)
				.addHotfixInfo(mockHF6);
		
		
		public final HotfixTrackingDocument mockTrackingDocCollection763 = new HotfixTrackingDocument("tracking_Collection_763", VERSION)
				.addHotfixInfo(mockHF7)
				.addHotfixInfo(mockHF8)
				.addHotfixInfo(mockHF9);
		
		public MockData() {
		}
	}
}
