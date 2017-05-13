package hfx.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class Test {
	public static void main(String[] args) throws FileNotFoundException, IOException {
//		Created on: 01-Dec-2016 19:10:26
		DateFormat df = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss", Locale.ENGLISH);
		String d = df.format(new Date());
		System.out.println(d);
	}
}
