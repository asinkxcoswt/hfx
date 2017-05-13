package hfx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import hfx.service.ClassJarDependencyResolver;
import hfx.service.DependencyResolver;
import hfx.service.MailServices;
import hfx.service.SystemFileHotfixServices;
import net.sf.ehcache.config.CacheConfiguration;

@Controller
@SpringBootApplication
@EnableCaching
public class Main {

	@RequestMapping("/")
	String index(Model model) {
		return "redirect:/hotfix";
	}

	@Bean
	SystemFileHotfixServices systemFileHotfixServices() {
		return new SystemFileHotfixServices();
	}
	
	@Bean
	MailServices mailServices() {
		return new MailServices();
	}

	@Bean
	DependencyResolver arCollectionDependencyResolver() {
		return new ClassJarDependencyResolver();
	}

	@Bean(destroyMethod = "shutdown")
	public net.sf.ehcache.CacheManager ehCacheManager() {
		CacheConfiguration HotfixInfoCache = new CacheConfiguration();
		HotfixInfoCache.setName("HotfixInfo");
		HotfixInfoCache.setMemoryStoreEvictionPolicy("LRU");
		HotfixInfoCache.setMaxEntriesLocalHeap(500);
		HotfixInfoCache.setTimeToIdleSeconds(60 * 60);

		CacheConfiguration FileInfoSet = new CacheConfiguration();
		FileInfoSet.setName("FileInfoSet");
		FileInfoSet.setMemoryStoreEvictionPolicy("LRU");
		FileInfoSet.setMaxEntriesLocalHeap(500);
		FileInfoSet.setTimeToIdleSeconds(60 * 60);

		net.sf.ehcache.config.Configuration config = new net.sf.ehcache.config.Configuration();
		config.addCache(HotfixInfoCache);
		config.addCache(FileInfoSet);

		return net.sf.ehcache.CacheManager.newInstance(config);
	}

	@Bean
	public CacheManager cacheManager() {
		return new EhCacheCacheManager(ehCacheManager());
	}

	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}
}
