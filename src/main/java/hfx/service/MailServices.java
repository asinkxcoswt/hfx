package hfx.service;

import java.util.List;

import hfx.model.MailAttachment;
import hfx.utils.MailBuilder;

public class MailServices {
	public void sendMail(List<String> mailto, List<String> mailcc, String senderName, String mailContent, List<MailAttachment> attachements) {
		new MailBuilder()
			.withReceivers(mailto.toArray(new String[mailto.size()]))
			.withCC(mailcc.toArray(new String[mailcc.size()]))
			.withSender(senderName)
			.withContent(mailContent)
			.withAttachements(attachements.toArray(new MailAttachment[attachements.size()]))
			.send();
	}
}
