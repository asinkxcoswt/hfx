package hfx.controller.api;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import hfx.model.MailAttachment;
import hfx.model.MailInfo;
import hfx.service.MailServices;

@Controller
@RequestMapping("/apis-mail")
public class MailAPIController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(MailAPIController.class);
	
	@Autowired
	private MailServices mailServices;
	
	@Value("${hfx.resource-location}")
	private String resourceLocation;
	
	@RequestMapping(value="/send", method=RequestMethod.POST)
	@ResponseBody
	void sendMailInfo(@RequestParam("mailInfo") MailInfo mailInfo) throws IOException {
		List<MailAttachment> attachments = new ArrayList<MailAttachment>();
		try {
			for (String attchID : mailInfo.getAttachements()) {
				String filePath = resourceLocation + "/" + attchID;
				File file = new File(filePath);
				if (file.exists() && file.isFile()) {
					InputStream content = new FileInputStream(file);
					String contentType = URLConnection.guessContentTypeFromStream(content);
					attachments.add(new MailAttachment(file.getName(), contentType, content));
				} else {
					LOGGER.info("Attachement does not exist : " + file.getPath());
				}
			}
			mailServices.sendMail(mailInfo.getMailto(), mailInfo.getMailcc(), mailInfo.getSenderName(), mailInfo.getMailBody(), attachments);	
		} finally {
			for (MailAttachment attch : attachments) {
				attch.getContent().close();
			}
		}
		
	}
	
	@RequestMapping(value="/resource/{resourceID:.+}", method=RequestMethod.PUT)
	@ResponseBody
	void putResource(@PathVariable("resourceID") String resourceID, @RequestParam("file") MultipartFile file)
			throws IOException {
		FileUtils.writeByteArrayToFile(new File(resourceLocation + "/" + resourceID), file.getBytes());
	}

	@RequestMapping(value = "/resource/{resourceID:.+}", method = RequestMethod.GET)
	@ResponseBody
	void getFile(@PathVariable("resourceID") String resourceID, HttpServletResponse response) {
		try {
			InputStream is = new FileInputStream(new File(resourceLocation + "/" + resourceID));
//			String contentType = URLConnection.guessContentTypeFromStream(is);
			IOUtils.copy(is, response.getOutputStream());
//			response.setContentType(contentType);
			response.flushBuffer();
		} catch (IOException e) {
			throw new RuntimeException("Error writing file to response output stream: " + e.getMessage(), e);
		}

	}
}
