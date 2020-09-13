package com.fintech.crypto.service.utility.mailGun;

import com.fintech.crypto.context.ShortMailTemplate;
import com.fintech.crypto.contract.Email;
import com.fintech.crypto.prop.AppProp;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("mail_gun")
public class MailGunSvc implements Email {

    @Autowired
    AppProp prop;

    @Override
    public void send(String subject, String header1, String header2, String message, String from, String to) {

        ShortMailTemplate shortMail = new ShortMailTemplate.Builder().setHeading1(header1).setHeading2(header2).setBody(message).build();
        try {
            HttpResponse<JsonNode> request = Unirest.post("https://api.mailgun.net/v3/" +prop.MAILGUN_DOMAIN + "/messages")
                    .basicAuth("api", prop.MAILGUN_API_KEY)
                    .field("from", String.format("Crypto Forex <%s>", from))
                    .field("to", to)
                    .field("subject", subject)
                    .field("html", shortMail.mutate())
                    .asJson();

//            System.out.println(request.getBody().toString());

        } catch (UnirestException e) {
            throw new RuntimeException("MailGun, incomplete mail request/, "+e.getMessage());
        }
    }
}
