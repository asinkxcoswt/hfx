package hfx.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class HotfixTrackingDocument {
	private String documentID;
	private int version;
	private List<HotfixInfo> hotfixList = new ArrayList<HotfixInfo>();
	private HotfixSearchParameters syncSettings = new HotfixSearchParameters();
	private Date updateStamp = null;
	
	@JsonCreator
	public HotfixTrackingDocument(
			@JsonProperty("documentID") String documentID, 
			@JsonProperty("version") int version) {
		this.documentID = documentID;
		this.version = version;
	}
	
	public String getDocumentID() {
		return documentID;
	}
	public void setDocumentID(String documentID) {
		this.documentID = documentID;
	}
	public int getVersion() {
		return version;
	}
	public void setVersion(int version) {
		this.version = version;
	}
	public List<HotfixInfo> getHotfixList() {
		return hotfixList;
	}
	public void setHotfixList(List<HotfixInfo> hotfixList) {
		this.hotfixList = hotfixList;
	}
	public HotfixTrackingDocument addHotfixInfo(HotfixInfo hf) {
		hotfixList.add(hf);
		return this;
	}

	public HotfixSearchParameters getSyncSettings() {
		return syncSettings;
	}

	public void setSyncSettings(HotfixSearchParameters syncSettings) {
		this.syncSettings = syncSettings;
	}

	@Override
	public String toString() {
		return "HotfixTrackingDocument [documentID=" + documentID + ", version=" + version + ", hotfixList="
				+ hotfixList + ", syncSettings=" + syncSettings + "]";
	}

	public Date getUpdateStamp() {
		return updateStamp;
	}

	public void setUpdateStamp(Date updateStamp) {
		this.updateStamp = updateStamp;
	}
	
}
