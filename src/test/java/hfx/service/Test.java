package hfx.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLConnection;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class Test {
	public static void main(String[] args) throws FileNotFoundException, IOException {
		String x = URLConnection.guessContentTypeFromName("xxx.txt");
		System.out.println(x);
	}
}
