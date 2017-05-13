package hfx.model;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class HotfixInfo {
	
	public static Date parseDate(String dateStr) {
		DateFormat df = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss", Locale.ENGLISH);
		try {
			return df.parse(dateStr);
		} catch (ParseException e) {
			throw new RuntimeException("Error while parsing date : " + e.getMessage(), e);
		}
	}
	
	public static String formatDate(Date d) {
		DateFormat df = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss", Locale.ENGLISH);
		return df.format(d);
	}
	
	private int HFID;
	private int version;
	private String creator;
	private String defectSummary;
	private String module;
	private Date creationDate;
	
	private Integer HFID2;
	private Integer HFID3;
	private Integer HFID4;
	private Date confirmDate;
	private Date manualDate;
	private Date productionDate;
	private Date cancelDate;
	private List<HotfixDependency> dependencies;
	
	private String sanityDesc;
	private String rollbackDesc;
	private String deploymentRemark;
	private Boolean isRestartRequired;
	
	private String location;
	private String instruction;
	private Boolean canAutoDeploy;
	private Integer rtNumber;
	private String files;
	private String memo;
	
	private boolean HFIDMailSentInd = false;
	private boolean HFID2MailSentInd = false;
	private boolean HFID3MailSentInd = false;
	private boolean HFID4MailSentInd = false;
	
	@JsonCreator
	public HotfixInfo(
			@JsonProperty("HFID") int HFID, 
			@JsonProperty("version") int version, 
			@JsonProperty("creator") String creator, 
			@JsonProperty("defectSummary") String defectSummary, 
			@JsonProperty("module") String module,
			@JsonProperty("creationDate") Date creationDate) {
		super();
		this.HFID = HFID;
		this.version = version;
		this.creator = creator;
		this.defectSummary = defectSummary;
		this.module = module;
		this.creationDate = creationDate;
	}

	public Integer getHFID2() {
		return HFID2;
	}

	public void setHFID2(Integer hfID2) {
		this.HFID2 = hfID2;
	}

	public Integer getHFID3() {
		return HFID3;
	}

	public void setHFID3(Integer hfID3) {
		this.HFID3 = hfID3;
	}

	public Integer getHFID4() {
		return HFID4;
	}

	public void setHFID4(Integer hfID4) {
		this.HFID4 = hfID4;
	}

	public Date getConfirmDate() {
		return confirmDate;
	}

	public void setConfirmDate(Date confirmDate) {
		this.confirmDate = confirmDate;
	}

	public Date getManualDate() {
		return manualDate;
	}

	public void setManualDate(Date manualDate) {
		this.manualDate = manualDate;
	}

	public Date getProductionDate() {
		return productionDate;
	}

	public void setProductionDate(Date productionDate) {
		this.productionDate = productionDate;
	}

	public boolean isHFIDMailSentInd() {
		return HFIDMailSentInd;
	}

	public void setHFIDMailSentInd(boolean hfIDMailSentInd) {
		this.HFIDMailSentInd = hfIDMailSentInd;
	}

	public boolean isHFID2MailSentInd() {
		return HFID2MailSentInd;
	}

	public void setHFID2MailSentInd(boolean hfID2MailSentInd) {
		this.HFID2MailSentInd = hfID2MailSentInd;
	}

	public boolean isHFID3MailSentInd() {
		return HFID3MailSentInd;
	}

	public void setHFID3MailSentInd(boolean hfID3MailSentInd) {
		this.HFID3MailSentInd = hfID3MailSentInd;
	}

	public boolean isHFID4MailSentInd() {
		return HFID4MailSentInd;
	}

	public void setHFID4MailSentInd(boolean hfID4MailSentInd) {
		this.HFID4MailSentInd = hfID4MailSentInd;
	}

	public int getHFID() {
		return HFID;
	}

	public int getVersion() {
		return version;
	}

	public String getCreator() {
		return creator;
	}

	public String getDefectSummary() {
		return defectSummary;
	}

	public String getModule() {
		return module;
	}

	public void setHFID(int hFID) {
		HFID = hFID;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public void setDefectSummary(String defectSummary) {
		this.defectSummary = defectSummary;
	}

	public void setModule(String module) {
		this.module = module;
	}
	
	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public List<HotfixDependency> getDependencies() {
		return dependencies;
	}

	public void setDependencies(List<HotfixDependency> dependencies) {
		this.dependencies = dependencies;
	}
	
	public HotfixInfo addDependency(int hfid, String dependencyType) {
		if (this.dependencies == null) {
			this.dependencies = new ArrayList<HotfixDependency>();
		}
		this.dependencies.add(new HotfixDependency(hfid, dependencyType));
		return this;
	}

	
	
	public String getSanityDesc() {
		return sanityDesc;
	}

	public void setSanityDesc(String sanityDesc) {
		this.sanityDesc = sanityDesc;
	}

	public String getRollbackDesc() {
		return rollbackDesc;
	}

	public void setRollbackDesc(String rollbackDesc) {
		this.rollbackDesc = rollbackDesc;
	}

	public String getDeploymentRemark() {
		return deploymentRemark;
	}

	public void setDeploymentRemark(String deploymentRemark) {
		this.deploymentRemark = deploymentRemark;
	}

	public Boolean getIsRestartRequired() {
		return isRestartRequired;
	}

	public void setIsRestartRequired(Boolean isRestartRequired) {
		this.isRestartRequired = isRestartRequired;
	}

	@Override
	public String toString() {
		return "HotfixInfo [HFID=" + HFID + ", version=" + version + ", creator=" + creator + ", defectSummary="
				+ defectSummary + ", module=" + module + ", creationDate=" + creationDate + ", HFID2=" + HFID2
				+ ", HFID3=" + HFID3 + ", HFID4=" + HFID4 + ", confirmDate=" + confirmDate + ", manualDate="
				+ manualDate + ", productionDate=" + productionDate + ", dependencies=" + dependencies + ", sanityDesc="
				+ sanityDesc + ", rollbackDesc=" + rollbackDesc + ", deploymentRemark=" + deploymentRemark
				+ ", isRestartRequired=" + isRestartRequired + ", HFIDMailSentInd=" + HFIDMailSentInd
				+ ", HFID2MailSentInd=" + HFID2MailSentInd + ", HFID3MailSentInd=" + HFID3MailSentInd
				+ ", HFID4MailSentInd=" + HFID4MailSentInd + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + HFID;
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
		HotfixInfo other = (HotfixInfo) obj;
		if (HFID != other.HFID)
			return false;
		return true;
	}

	public Date getCancelDate() {
		return cancelDate;
	}

	public void setCancelDate(Date cancelDate) {
		this.cancelDate = cancelDate;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getInstruction() {
		return instruction;
	}

	public void setInstruction(String instruction) {
		this.instruction = instruction;
	}

	public Boolean getCanAutoDeploy() {
		return canAutoDeploy;
	}

	public void setCanAutoDeploy(Boolean canAutoDeploy) {
		this.canAutoDeploy = canAutoDeploy;
	}

	public Integer getRtNumber() {
		return rtNumber;
	}

	public void setRtNumber(Integer rtNumber) {
		this.rtNumber = rtNumber;
	}

	public String getFiles() {
		return files;
	}

	public void setFiles(String string) {
		this.files = string;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}
}
