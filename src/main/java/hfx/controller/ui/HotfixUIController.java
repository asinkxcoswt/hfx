package hfx.controller.ui;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import hfx.model.FileInfo;
import hfx.model.HotfixInfo;
import hfx.service.SystemFileHotfixServices;

@Controller
@RequestMapping("/hotfix")
public class HotfixUIController {

	@Autowired
	private SystemFileHotfixServices systemFileHotfixServices;

	@RequestMapping("")
	String index(Model model) {
		Map<Integer, List<String>> allTrackingDoc = systemFileHotfixServices.getAllTrackingDocument();
		model.addAttribute("allTrackingDoc", allTrackingDoc);
		return "index";
	}
	
	@RequestMapping("/{version}/{HFID}")
	String seeHotfixInfo(@PathVariable("version") int version, @PathVariable int HFID, Model model) {
		HotfixInfo hotfixInfo = systemFileHotfixServices.getHotfixInfo(HFID, version);
		List<FileInfo> fileInfoList = systemFileHotfixServices.getFileInfo(HFID, version);
		String readme = systemFileHotfixServices.getReadMeContent(HFID, version);
		model.addAttribute("hotfixInfo", hotfixInfo);
		model.addAttribute("fileInfoList", fileInfoList);
		model.addAttribute("readme", readme);
		return "hotfix/hotfix-info";
	}

	@RequestMapping("/tracking-doc/{version}/{documentID}")
	String hotfixTrackingScreen(@PathVariable("version") int version, @PathVariable("documentID") String documentID,
			Model model) {

		model.addAttribute("version", version);
		model.addAttribute("documentID", documentID);
		return "hotfix/hotfix-tracking";
	}

	@RequestMapping("/tracking-doc/{version}")
	String hotfixTrackingDocumentList(@PathVariable("version") int version, Model model) {

		List<String> trackingDocumentList = systemFileHotfixServices.getTrackingDocumentList(version);
		model.addAttribute("trackingDocumentList", trackingDocumentList);
		return "hotfix/hotfixTrackingDocumentList";
	}
}
