package hfx.model;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import org.apache.commons.io.FileUtils;

public class FileInfo {

	private String fileName;
	private long fileSize;
	private Date lastModifiedDate;
	private String filePath;
	
	public FileInfo() {
	}
	
	public FileInfo(String fileURL) {
		this(new File(fileURL));
	}
	
	public FileInfo(File file) {
		this.fileName = file.getName();
		this.fileSize = file.getTotalSpace();
		this.lastModifiedDate = new Date(file.lastModified());
		this.filePath = file.getPath();
	}

	public String getFileName() {
		return fileName;
	}

	public FileInfo setFileName(String fileName) {
		this.fileName = fileName;
		return this;
	}

	public long getFileSize() {
		return fileSize;
	}

	public FileInfo setFileSize(long fileSize) {
		this.fileSize = fileSize;
		return this;
	}

	public Date getLastModifiedDate() {
		return lastModifiedDate;
	}

	public FileInfo setLastModifiedDate(Date lastModifiedDate) {
		this.lastModifiedDate = lastModifiedDate;
		return this;
	}

	public String getFilePath() {
		return filePath;
	}

	public FileInfo setFilePath(String filePath) {
		this.filePath = filePath;
		return this;
	}

	@Override
	public String toString() {
		return "FileInfo [fileName=" + fileName + ", fileSize=" + fileSize + ", lastModifiedDate=" + lastModifiedDate
				+ ", filePath=" + filePath + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((fileName == null) ? 0 : fileName.hashCode());
		result = prime * result + ((filePath == null) ? 0 : filePath.hashCode());
		result = prime * result + (int) (fileSize ^ (fileSize >>> 32));
		result = prime * result + ((lastModifiedDate == null) ? 0 : lastModifiedDate.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		FileInfo other = (FileInfo) obj;
		if (fileName == null) {
			if (other.fileName != null)
				return false;
		} else if (!fileName.equals(other.fileName))
			return false;
		if (filePath == null) {
			if (other.filePath != null)
				return false;
		} else if (!filePath.equals(other.filePath))
			return false;
		if (fileSize != other.fileSize)
			return false;
		if (lastModifiedDate == null) {
			if (other.lastModifiedDate != null)
				return false;
		} else if (!lastModifiedDate.equals(other.lastModifiedDate))
			return false;
		return true;
	}

}
