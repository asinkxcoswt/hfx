package hfx.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import hfx.model.MailAttachment;
import hfx.utils.MailBuilder;

public class MailServices {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(MailServices.class);
	
	public void sendMail(List<String> mailto, List<String> mailcc, String senderName, String mailSubject, String mailContent, List<MailAttachment> attachements) {
		LOGGER.debug("Sending Mail to : " + mailto);
		new MailBuilder()
			.withReceivers(mailto.toArray(new String[mailto.size()]))
			.withCC(mailcc.toArray(new String[mailcc.size()]))
			.withSender(senderName)
			.withSubject(mailSubject)
			.withContent(mailContent)
			.withAttachements(attachements.toArray(new MailAttachment[attachements.size()]))
			.send();
	}
}
