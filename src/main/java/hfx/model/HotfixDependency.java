package hfx.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class HotfixDependency {
	private final int hfid;
	private final String dependencyType;
	
	@JsonCreator
	public HotfixDependency(
			@JsonProperty("hfid") int hfid, 
			@JsonProperty("dependencyType") String dependencyType) {
		super();
		this.hfid = hfid;
		this.dependencyType = dependencyType;
	}

	public int getHfid() {
		return hfid;
	}

	public String getDependencyType() {
		return dependencyType;
	}
	
}
