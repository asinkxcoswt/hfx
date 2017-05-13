package hfx.service;

import java.io.IOException;
import java.util.Enumeration;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import hfx.model.FileInfo;

public class ClassJarDependencyResolver extends SameFileDependencyResolver {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SameFileDependencyResolver.class);
	
	@Override
	protected boolean isFileDependent(FileInfo f1, FileInfo f2) {
		if (super.isFileDependent(f1, f2)) {
			return true;
		}
		
		if (f2.getFileName().endsWith(".class") && f1.getFileName().endsWith(".jar")) {
			if (classFileExistsInJar(f2, f1)) {
				return true;
			}
		}
		return false;
	}
	
	private boolean classFileExistsInJar(FileInfo classFile, FileInfo jarFile) {
		JarFile jar = null;
		try {
			jar = new JarFile(jarFile.getFilePath());
			Enumeration<JarEntry> entries = jar.entries();
			
			while (entries.hasMoreElements()) {
				JarEntry e = entries.nextElement();
				if (e.getName().endsWith(classFile.getFileName())) {
					return true;
				}
			}
		} catch (IOException e) {
			throw new RuntimeException("Error while reading jar file : " + e.getMessage(), e);
		} finally {
			if (jar != null) {
				try {
					jar.close();
				} catch (IOException e) {
					throw new RuntimeException("Error while closing jar file : " + e.getMessage(), e);
				}
			}
		}
		return false;
	}

	@Override
	protected boolean isFileReplacing(FileInfo f1, FileInfo f2) {
		return isFileDependent(f1, f2);
	}
}
