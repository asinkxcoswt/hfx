package hfx.utils;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;

import hfx.model.MailAttachment;

public class MailBuilder {
	private File tempFile = new File(System.getProperty("java.io.tmpdir"), "HFX_" + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()) + ".html");
	private String sender;
	private StringBuilder receivers = new StringBuilder();
	private StringBuilder ccs = new StringBuilder();
	private StringBuilder content = new StringBuilder();
	private String contentType = "text/html";
	private String subject;
	private List<MailAttachment> attachments = new ArrayList<MailAttachment>();
	
	private Consumer<Exception> errorHandler = new Consumer<Exception>() {
		@Override
		public void accept(Exception t) {
			// do nothing
		}
	};
	
	private Runnable successHandler = new Runnable() {
		@Override
		public void run() {
			// do nothing
		}
	};
	
	public MailBuilder withMailContentSavedToFile(File file) {
		this.tempFile = file;
		return this;
	}
	public MailBuilder onError(Consumer<Exception> handler) {
		this.errorHandler = handler;
		return this;
	}
	public MailBuilder onSuccess(Runnable handler) {
		this.successHandler = handler;
		return this;
	}
	public MailBuilder withAttachements(MailAttachment ... attachments) {
		this.attachments.addAll(Arrays.asList(attachments));
		return this;
	}
	public MailBuilder withReceivers(String ... mailAddresses) {
		for (String addr : mailAddresses) {
			if (receivers.length() == 0) {
				receivers.append(addr);
			} else {
				receivers.append(","+addr);
			}
		}
		
		return this;
	}
	public MailBuilder withSender(String senderName) {
		this.sender = senderName;
		return this;
	}
	public MailBuilder withCC(String ... mailAddresses) {
		for (String addr : mailAddresses) {
			if (ccs.length() == 0) {
				ccs.append(addr);
			} else {
				ccs.append(","+addr);
			}
		}
		return this;
	}
	public MailBuilder withSubject(String subject) {
		this.subject = subject;
		return this;
	}
	public MailBuilder withContent(String content) {
		this.content = new StringBuilder(content);
		return this;
	}
	public String getContentType() {
		return contentType;
	}
	public MailBuilder withContentType(String contentType) {
		this.contentType = contentType;
		return this;
	}
	public MailBuilder appendContent(String content) {
		this.content.append(content);
		return this;
	}
	public MailBuilder clearContent(String content) {
		this.content = new StringBuilder();
		return this;
	}
	
	/**
	 * Load attributes from table. Not yet support in this version.
	 * @param propertyName
	 * @return
	 */
	public MailBuilder loadFromProperties(String propertyName) {
		throw new UnsupportedOperationException("Not support in this version.");
	}
	
	
	private void generateTempFile() {
		Session session = null;
		FileOutputStream tempFile = null;
	    try {
	    	tempFile = new FileOutputStream(this.getTempFilePath());
	        Message message;
	        message = new MimeMessage(session);
	        message.setFrom(new InternetAddress(this.sender));
	        message.setRecipients(Message.RecipientType.TO,
	                InternetAddress.parse(this.receivers.toString()));
	        message.addRecipients(Message.RecipientType.CC, InternetAddress.parse(this.ccs.toString()));

	        message.setSubject(this.subject);
	        Multipart multipart = new MimeMultipart();
	        
	        BodyPart content = new MimeBodyPart();
	        content.setContent(this.content.toString(), this.contentType);
	        multipart.addBodyPart(content);
	        
	        for (MailAttachment attch : this.attachments) {
	        	DataSource ds = new ByteArrayDataSource(attch.getContent(), attch.getMimeType());
		        BodyPart attach1 = new MimeBodyPart();
		        attach1.setDataHandler(new DataHandler(ds));
		        attach1.setFileName(attch.getName());
		        multipart.addBodyPart(attach1);
	        }
	        
	        message.setContent(multipart);
	        BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(this.getTempFilePath()));
	        message.writeTo(out);
	    } catch (MessagingException e) {
	        throw new RuntimeException("Error while generate mail temp file: " + e.getMessage(), e);
	    } catch (IOException e) {
	    	throw new RuntimeException("Error while generate mail temp file: " + e.getMessage(), e);
		} finally {
			if (tempFile != null) {
				try {
					tempFile.close();
				} catch (IOException e) {
					throw new RuntimeException("Error while closing temp file: " + e.getMessage(), e);
				}
			}
		}
	}
	private String getTempFilePath() {
		return tempFile.getAbsolutePath();
	}
	private String getMailTo() {
		return receivers.toString();
	}
	private String getMailCC() {
		return ccs.toString();
	}
	private Runnable getSuccessHandler() {
		return successHandler;
	}
	private Consumer<Exception> getErrorHandler() {
		return errorHandler;
	}
	public void send() {
		try {
			Runtime runtime = Runtime.getRuntime();
			generateTempFile();
			String command = "cat " + getTempFilePath() + " | sendmail '" + getMailTo() + "' '" + getMailCC() + "'";
			int exitCode = runtime.exec(new String[] { "/bin/ksh", "-c", command }).waitFor();
			if (exitCode == 0) {
				getSuccessHandler().run();
			} else {
				throw new RuntimeException("sendmail command exit with non-zero code : " + exitCode);
			}
		} catch (Exception e) {
			try {
				getErrorHandler().accept(e);
			} catch (Exception e1) {
				throw new RuntimeException(e1.getMessage(), e1);
			}
		}
	}
}
