package hfx.model;

import java.util.ArrayList;
import java.util.List;

public class MailInfo {
	private String subject = "Nosubject";
	private List<String> mailto = new ArrayList<String>();
	private List<String> mailcc = new ArrayList<String>();
	private String senderName = "Anonymous";
	private String mailBody = "Nobody";
	private List<String> attachements = new ArrayList<String>();
	public String getSubject() {
		return subject;
	}
	public MailInfo setSubject(String subject) {
		this.subject = subject;
		return this;
	}
	public List<String> getMailto() {
		return mailto;
	}
	public MailInfo setMailto(List<String> mailto) {
		this.mailto = mailto;
		return this;
	}
	public List<String> getMailcc() {
		return mailcc;
	}
	public MailInfo setMailcc(List<String> mailcc) {
		this.mailcc = mailcc;
		return this;
	}
	public String getSenderName() {
		return senderName;
	}
	public MailInfo setSenderName(String senderName) {
		this.senderName = senderName;
		return this;
	}
	public String getMailBody() {
		return mailBody;
	}
	public MailInfo setMailBody(String mailBody) {
		this.mailBody = mailBody;
		return this;
	}
	public List<String> getAttachements() {
		return attachements;
	}
	public MailInfo setAttachements(List<String> attachements) {
		this.attachements = attachements;
		return this;
	}
	
	@Override
	public String toString() {
		return "MailInfo [subject=" + subject + ", mailto=" + mailto + ", mailcc=" + mailcc + ", senderName="
				+ senderName + ", mailBody=" + mailBody + ", attachements=" + attachements + "]";
	}
	
}
