package hfx.service;

import java.util.List;

import hfx.model.FileInfo;

public interface DependencyResolver {
	/**
	 * Determine if fs2 is a dependency of fs1
	 * @param root
	 * @param next
	 * @return true of so, false otherwise.
	 */
	boolean isDependent(List<FileInfo> root, List<FileInfo> next);

	void mergeFileSets(List<FileInfo> root, List<FileInfo> next);
}
