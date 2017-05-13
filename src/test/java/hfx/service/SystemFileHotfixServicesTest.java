package hfx.service;

import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasEntry;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.collection.IsIterableContainingInAnyOrder.containsInAnyOrder;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.junit4.SpringRunner;

import com.fasterxml.jackson.databind.ObjectMapper;

import hfx.MockingEnvConfiguration.MockData;
import hfx.model.FileInfo;
import hfx.model.HotfixInfo;
import hfx.model.HotfixSearchParameters;
import hfx.model.HotfixTrackingDocument;

@RunWith(SpringRunner.class)
@SpringBootTest
@Profile("dev")
public class SystemFileHotfixServicesTest {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SystemFileHotfixServicesTest.class);
	
	@Value("${hfx.hotfix-location}")
	private String hotfixLocation;
	
	@Value("${hfx.tracking-doc-location}")
	private String trackingDocLocation;
	
	@Autowired
	private MockData mockData;
	
	@Autowired
	private SystemFileHotfixServices systemFileHotfixServices;
	
	@Test
//	@Ignore
	public void testGetHotfixInfo() {
		LOGGER.debug("begin");
		HotfixInfo resultHF = systemFileHotfixServices.getHotfixInfo(mockData.mockHF1.getHFID(), mockData.mockHF1.getVersion());
		assertThat(mockData.mockHF1.getHFID(), is(resultHF.getHFID()));
		assertThat(mockData.mockHF1.getCreator(), is(resultHF.getCreator()));
		assertThat(mockData.mockHF1.getModule(), is(resultHF.getModule()));
		assertThat(mockData.mockHF1.getDefectSummary(), is(resultHF.getDefectSummary()));
		assertThat(mockData.mockHF1.getCreationDate(), is(resultHF.getCreationDate()));
	}
	
	@Test
//	@Ignore
	public void testAnalizeHotfixDependencyOnItself() {
		LOGGER.debug("begin");
		// hf1 should depend on itself
		List<Integer> inputList = Arrays.asList(mockData.mockHF1.getHFID());
		List<Integer> expectedList = Arrays.asList(mockData.mockHF1.getHFID());
		List<Integer> resultList = systemFileHotfixServices.analizeDependencyARCollection(inputList, mockData.VERSION);
		assertThat(resultList, is(expectedList));
	}
	
	@Test
//	@Ignore
	public void testAnalizeHotfixDependencyIndependent() {
		LOGGER.debug("begin");
		// hf2 should not depend on hf1
		List<Integer> inputList = Arrays.asList(mockData.mockHF2.getHFID(), mockData.mockHF1.getHFID());
		List<Integer> expectedList = Arrays.asList(mockData.mockHF2.getHFID());
		List<Integer> resultList = systemFileHotfixServices.analizeDependencyARCollection(inputList, mockData.VERSION);
		assertThat(resultList, is(expectedList));
		
		// hf4 should not depend hf1, hf2, hf3
		List<Integer> inputList2 = Arrays.asList(mockData.mockHF4.getHFID(), mockData.mockHF3.getHFID(), mockData.mockHF2.getHFID(), mockData.mockHF1.getHFID());
		List<Integer> expectedList2 = Arrays.asList(mockData.mockHF4.getHFID());
		List<Integer> resultList2 = systemFileHotfixServices.analizeDependencyARCollection(inputList2, mockData.VERSION);
		assertThat(resultList2, is(expectedList2));
	}
	
	@Test
//	@Ignore
	public void testAnalizeHotfixDependencySameFile() {
		LOGGER.debug("begin");
		// hf3 should depend on hf1 but not hf2 because they have the same A1.class
		List<Integer> inputList = Arrays.asList(mockData.mockHF3.getHFID(), mockData.mockHF2.getHFID(), mockData.mockHF1.getHFID());
		List<Integer> expectedList = Arrays.asList(mockData.mockHF3.getHFID(), mockData.mockHF1.getHFID());
		List<Integer> resultList = systemFileHotfixServices.analizeDependencyARCollection(inputList, mockData.VERSION);
		assertThat(resultList, is(expectedList));
	}
	
	@Test
//	@Ignore
	public void testAnalizeHotfixDependencyClassJar() {
		LOGGER.debug("begin");
		// hf5 should depend on hf3 and hf1 but not hf2 and hf4 because J1.jar contains only A*.class
		List<Integer> inputList = Arrays.asList(mockData.mockHF5.getHFID(), mockData.mockHF4.getHFID(), mockData.mockHF3.getHFID(), mockData.mockHF2.getHFID(), mockData.mockHF1.getHFID());
		List<Integer> expectedList = Arrays.asList(mockData.mockHF5.getHFID(), mockData.mockHF3.getHFID(), mockData.mockHF1.getHFID());
		List<Integer> resultList = systemFileHotfixServices.analizeDependencyARCollection(inputList, mockData.VERSION);
		assertThat(resultList, is(expectedList));
	}
	
	@Test
//	@Ignore
	public void testAnalizeHotfixDependencyClassJarSome() {
		LOGGER.debug("begin");
		// hf6 should depend on hf2 but not hf1, hf3, hf4, hf5 because J2.jar contains only B*.class
		List<Integer> inputList = Arrays.asList(mockData.mockHF6.getHFID(), mockData.mockHF5.getHFID(), mockData.mockHF4.getHFID(), mockData.mockHF3.getHFID(), mockData.mockHF2.getHFID(), mockData.mockHF1.getHFID());
		List<Integer> expectedList = Arrays.asList(mockData.mockHF6.getHFID(), mockData.mockHF2.getHFID());
		List<Integer> resultList = systemFileHotfixServices.analizeDependencyARCollection(inputList, mockData.VERSION);
		assertThat(resultList, is(expectedList));
	}
	
	@Test
//	@Ignore
	public void testGetFileInfo() {
		LOGGER.debug("begin");
		List<FileInfo> result = systemFileHotfixServices.getFileInfo(mockData.mockHF1.getHFID(), mockData.mockHF1.getVersion());
		assertThat(result, hasSize(mockData.mockHF1FileSet.size() + 1)); // mockData.mockHF1FIleSet does not have the README file.
	}
	
	@Test
//	@Ignore
	public void testGetTrackingDocumentList() {
		LOGGER.debug("begin");
		List<String> result = systemFileHotfixServices.getTrackingDocumentList(mockData.VERSION);
		assertThat(result, containsInAnyOrder(mockData.mockTrackingDocAR763.getDocumentID(), mockData.mockTrackingDocCollection763.getDocumentID()));
	}
	
	@Test
//	@Ignore
	public void testGetTrackingDocument() throws IOException {
		LOGGER.debug("begin");
		HotfixTrackingDocument result = systemFileHotfixServices.getTrackingDocument(mockData.mockTrackingDocAR763.getVersion(), mockData.mockTrackingDocAR763.getDocumentID());
		ObjectMapper mapper = new ObjectMapper();
		assertThat(mapper.writeValueAsString(result), is(mapper.writeValueAsString(mockData.mockTrackingDocAR763)));
	}
	
	@Test
//	@Ignore
	public void testSaveTrackingDocument() throws IOException {
		LOGGER.debug("begin");
		HotfixTrackingDocument doc = new HotfixTrackingDocument("testSaveTrackingDocument_doc", mockData.VERSION)
				.addHotfixInfo(mockData.mockHF1)
				.addHotfixInfo(mockData.mockHF2)
				.addHotfixInfo(mockData.mockHF3);
		
		systemFileHotfixServices.saveTrackingDocument(doc);
		HotfixTrackingDocument result = systemFileHotfixServices.getTrackingDocument(doc.getVersion(), doc.getDocumentID());
		ObjectMapper mapper = new ObjectMapper();
		assertThat(mapper.writeValueAsString(result), is(mapper.writeValueAsString(doc)));
		FileUtils.forceDelete(new File(SystemFileHotfixServices.TRACKING_DOC_FILE_PATH(trackingDocLocation, doc.getVersion(), doc.getDocumentID())));
	}
	
	List<Integer> HFIDList(List<HotfixInfo> hf) {
		List<Integer> HFIDList = new ArrayList<Integer>();
		for (HotfixInfo f : hf) {
			HFIDList.add(f.getHFID());
		}
		return HFIDList;
	}
	
	@Test
//	@Ignore
	public void testSearchHotfixByModule() {
		LOGGER.debug("begin");
		List<HotfixInfo> result = systemFileHotfixServices.searchHotfix(mockData.VERSION, new HotfixSearchParameters()
				.setModule(Arrays.asList("AR")));
		
		List<Integer> HFIDList = HFIDList(result);
		
		Assert.assertTrue(HFIDList.contains(mockData.mockHF1.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF2.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF3.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF4.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF5.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF6.getHFID()));
		Assert.assertTrue(!HFIDList.contains(mockData.mockHF7.getHFID()));
		Assert.assertTrue(!HFIDList.contains(mockData.mockHF8.getHFID()));
		Assert.assertTrue(!HFIDList.contains(mockData.mockHF9.getHFID()));
		
		result = systemFileHotfixServices.searchHotfix(mockData.VERSION, new HotfixSearchParameters()
				.setModule(Arrays.asList("Collection")));

//		LOGGER.debug(result.toString());
		
		HFIDList = HFIDList(result);
		
		Assert.assertTrue(!HFIDList.contains(mockData.mockHF1.getHFID()));
		Assert.assertTrue(!HFIDList.contains(mockData.mockHF2.getHFID()));
		Assert.assertTrue(!HFIDList.contains(mockData.mockHF3.getHFID()));
		Assert.assertTrue(!HFIDList.contains(mockData.mockHF4.getHFID()));
		Assert.assertTrue(!HFIDList.contains(mockData.mockHF5.getHFID()));
		Assert.assertTrue(!HFIDList.contains(mockData.mockHF6.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF7.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF8.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF9.getHFID()));
		
		result = systemFileHotfixServices.searchHotfix(mockData.VERSION, new HotfixSearchParameters()
				.setModule(Arrays.asList("Collection", "AR")));
		
//		LOGGER.debug(result.toString());
		
		HFIDList = HFIDList(result);
		
		Assert.assertTrue(HFIDList.contains(mockData.mockHF1.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF2.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF3.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF4.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF5.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF6.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF7.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF8.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF9.getHFID()));
	}
	
	@Test
//	@Ignore
	public void testSearchHotfixByDFSummary() {
		LOGGER.debug("begin");
		List<HotfixInfo> result = systemFileHotfixServices.searchHotfix(mockData.VERSION, new HotfixSearchParameters()
				.setDfSummaryKeyword("6007"));
		
//		LOGGER.debug(result.toString());
		
		List<Integer> HFIDList = HFIDList(result);
		
		Assert.assertTrue(HFIDList.contains(mockData.mockHF7.getHFID()));
		Assert.assertTrue(!HFIDList.contains(mockData.mockHF8.getHFID()));
		
		result = systemFileHotfixServices.searchHotfix(mockData.VERSION, new HotfixSearchParameters()
				.setDfSummaryKeyword("Bug"));
		
//		LOGGER.debug(result.toString());
		
		HFIDList = HFIDList(result);
		
		Assert.assertTrue(HFIDList.contains(mockData.mockHF1.getHFID()));
		Assert.assertTrue(HFIDList.contains(mockData.mockHF7.getHFID()));
		Assert.assertTrue(!HFIDList.contains(mockData.mockHF9.getHFID()));
	}
	
	@Test
	public void testSeachHotfixByHFIDAfter() {
		LOGGER.debug("begin");
		List<HotfixInfo> result = systemFileHotfixServices.searchHotfix(mockData.VERSION, new HotfixSearchParameters()
				.setHFIDAfter(mockData.mockHF6.getHFID()));
		LOGGER.debug(result.toString());
		assertThat(result, hasItem(mockData.mockHF7));
	}
	
	@Test
	public void testCaching() throws IOException {
		LOGGER.debug("begin");
		HotfixInfo hf1= systemFileHotfixServices.getHotfixInfo(mockData.mockHF1.getHFID(), mockData.mockHF1.getVersion());
		HotfixInfo hf2= systemFileHotfixServices.getHotfixInfo(mockData.mockHF1.getHFID(), mockData.mockHF1.getVersion());
		Assert.assertTrue("hf1 should be the same object as hf2 due to cache hit.", hf1 == hf2);
		
		systemFileHotfixServices.refreshHotfixInfo(mockData.mockHF1.getHFID());
		HotfixInfo hf3 = systemFileHotfixServices.getHotfixInfo(mockData.mockHF1.getHFID(), mockData.mockHF1.getVersion());
		
		Assert.assertTrue("hf3 should be a different object due to cache miss.", hf1 != hf3);
	}
	
	@Test
	public void testGetAllTrackingDocument() {
		LOGGER.debug("begin");
		Map<Integer, List<String>> trakcingDoc = systemFileHotfixServices.getAllTrackingDocument();
		assertThat(trakcingDoc, hasEntry(is(763), hasItem(mockData.mockTrackingDocAR763.getDocumentID())));
	}
}

