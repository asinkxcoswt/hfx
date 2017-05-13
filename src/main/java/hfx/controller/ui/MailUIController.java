package hfx.controller.ui;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import hfx.model.MailInfo;

@Controller
@RequestMapping("/mail")
public class MailUIController {

	@RequestMapping("")
	String getMailClient(@RequestBody MailInfo mailInfo, Model model) {
		model.addAttribute("mailInfo", mailInfo);
		return "mail/mail";
	}
}
