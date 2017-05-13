package hfx.controller.api;

import java.io.FileNotFoundException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import hfx.model.HotfixInfo;
import hfx.model.HotfixSearchParameters;
import hfx.model.HotfixTrackingDocument;
import hfx.service.SystemFileHotfixServices;

@Controller
@RequestMapping("/apis-hotfix")
public class HotfixAPIController {
	
	@Autowired
	private SystemFileHotfixServices systemFileHotfixServices;
	
	@RequestMapping("/hotfix/{version}/{hfID}")
	@ResponseBody
	HotfixInfo getHotfixInfo(
			@PathVariable("version") int version,
			@PathVariable("hfID") int hfID) {
		return systemFileHotfixServices.getHotfixInfo(hfID, version);
	}
	
	@RequestMapping("/hotfix/{version}/{hfID}/refresh")
	@ResponseBody
	void refreshHotfixInfo(
			@PathVariable("version") int version,
			@PathVariable("hfID") int hfID) {
		systemFileHotfixServices.refreshHotfixInfo(hfID);
		systemFileHotfixServices.refreshFileInfoSet(hfID);
	}
	
	@RequestMapping("/hotfix-dependency/{version}")
	@ResponseBody
	List<Integer> analizeDependency(
			@RequestParam("hfid[]") List<Integer> hfs,
			@PathVariable("version") int version) {
		return systemFileHotfixServices.analizeDependencyARCollection(hfs, version);
	}
	
	@RequestMapping(value="/search-hotfix/{version}", method=RequestMethod.POST)
	@ResponseBody
	List<HotfixInfo> searchHotfixInfo(
			@PathVariable("version") int version,
			@RequestBody HotfixSearchParameters searchParams) {
		
		return systemFileHotfixServices.searchHotfix(version, searchParams);
	}
	
	@RequestMapping(value="/tracking-document/{version}")
	@ResponseBody
	List<String> getTrackingDocumentList(
			@PathVariable("version") int version) {
		return systemFileHotfixServices.getTrackingDocumentList(version);
	}
	
	@RequestMapping(value="/tracking-document/{version}/{documentID}", produces="application/json")
	@ResponseBody
	HotfixTrackingDocument getTrackingDocument(
			@PathVariable("version") int version,
			@PathVariable("documentID") String documentID) {
		HotfixTrackingDocument trackingDoc;
		try {
			trackingDoc = systemFileHotfixServices.getTrackingDocument(version, documentID);
		} catch (FileNotFoundException e) {
			trackingDoc = new HotfixTrackingDocument(documentID, version);
		} 
		return trackingDoc;
	}
	
	@RequestMapping(value="/tracking-document/save", method=RequestMethod.POST, produces="application/json")
	@ResponseBody
	void saveTrackingDocument(@RequestBody HotfixTrackingDocument doc) {
		systemFileHotfixServices.saveTrackingDocument(doc);
	}
}
