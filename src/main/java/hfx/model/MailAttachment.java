package hfx.model;

import java.io.InputStream;

public class MailAttachment {
	private final String name;
	private final String mimeType;
	private final InputStream content;
	public MailAttachment(String name, String mimeType, InputStream content) {
		super();
		this.name = name;
		this.mimeType = mimeType;
		this.content = content;
	}
	public String getName() {
		return name;
	}
	public String getMimeType() {
		return mimeType;
	}
	public InputStream getContent() {
		return content;
	}
	
	
}
