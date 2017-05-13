package hfx.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import hfx.model.FileInfo;

public class SameFileDependencyResolver implements DependencyResolver {

	private static final Logger LOGGER = LoggerFactory.getLogger(SameFileDependencyResolver.class);
	
	@Override
	public boolean isDependent(List<FileInfo> fs1, List<FileInfo> fs2) {
		for (FileInfo f1 : fs1) {
			for (FileInfo f2 : fs2) {
				if (isFileDependent(f1, f2)) {
					return true;
				}
			}
		}
		return false;
	}

	@Override
	public void mergeFileSets(List<FileInfo> fs1, List<FileInfo> fs2) {
		// user addSet to avoid ConcurrentModificationException
		Set<FileInfo> addSet = new HashSet<FileInfo>();
		for (FileInfo f1 : fs1) {
			for (FileInfo f2 : fs2) {
				if (!isFileReplacing(f1, f2)) {
					addSet.add(f2);
				}
			}
		}
		fs1.addAll(addSet);
	}
	
	protected boolean isFileDependent(FileInfo f1, FileInfo f2) {
		return f1.getFileName().equals(f2.getFileName());
	}

	protected boolean isFileReplacing(FileInfo f1, FileInfo f2) {
		return isFileDependent(f1, f2);
	}
}
