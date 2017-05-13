package hfx.model;

import java.util.ArrayList;
import java.util.List;

public class HotfixSearchParameters {
	private List<String> module = new ArrayList<String>();
	private Integer HFIDAfter = null;
	private String filenameKeyword = null;
	private String dfSummaryKeyword = null;
	private Boolean includeTrueHF = true;
	private Boolean includeAmdocsHF = true;
	
	public List<String> getModule() {
		return module;
	}
	public HotfixSearchParameters setModule(List<String> module) {
		this.module = module;
		return this;
	}
	public String getFilenameKeyword() {
		return filenameKeyword;
	}
	public HotfixSearchParameters setFilenameKeyword(String filenameKeyword) {
		this.filenameKeyword = filenameKeyword;
		return this;
	}
	public String getDfSummaryKeyword() {
		return dfSummaryKeyword;
	}
	public HotfixSearchParameters setDfSummaryKeyword(String dfSummaryKeyword) {
		this.dfSummaryKeyword = dfSummaryKeyword;
		return this;
	}
	public Boolean getIncludeTrueHF() {
		return includeTrueHF;
	}
	public HotfixSearchParameters setIncludeTrueHF(Boolean includeTrueHF) {
		this.includeTrueHF = includeTrueHF;
		return this;
	}
	public Boolean getIncludeAmdocsHF() {
		return includeAmdocsHF;
	}
	public HotfixSearchParameters setIncludeAmdocsHF(Boolean includeAmdocsHF) {
		this.includeAmdocsHF = includeAmdocsHF;
		return this;
	}
	public Integer getHFIDAfter() {
		return HFIDAfter;
	}
	public HotfixSearchParameters setHFIDAfter(Integer hFIDAfter) {
		HFIDAfter = hFIDAfter;
		return this;
	}
	@Override
	public String toString() {
		return "HotfixSearchParameters [module=" + module + ", HFIDAfter=" + HFIDAfter + ", filenameKeyword="
				+ filenameKeyword + ", dfSummaryKeyword=" + dfSummaryKeyword + ", includeTrueHF=" + includeTrueHF
				+ ", includeAmdocsHF=" + includeAmdocsHF + "]";
	}
	
}
