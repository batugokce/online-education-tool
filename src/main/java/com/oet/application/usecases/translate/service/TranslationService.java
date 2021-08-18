package com.oet.application.usecases.translate.service;

import com.google.gson.*;
import com.oet.application.common.ResponseTemplate;
import com.squareup.okhttp.*;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import static com.oet.application.common.CommonMessages.*;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class TranslationService {

    //TODO; key değişmeli
    private static final String subscriptionKey = "subscription-key";
    private static final String endpoint = "https://api.cognitive.microsofttranslator.com/";
    String url = endpoint + "/translate?api-version=3.0&from=en&to=tr";

    // Instantiates the OkHttpClient.
    OkHttpClient client = new OkHttpClient();

    public ResponseTemplate translate(String word) {
        try {
            String response = Post(word);

            JSONArray jsonArray = new JSONArray(response);
            JSONObject jsonObject = jsonArray.getJSONObject(0);
            String text = jsonObject.getJSONArray("translations").getJSONObject(0).getString("text");
            return new ResponseTemplate(SUCCESS, TRANSLATION_IS_SUCCESSFUL, text);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseTemplate(ERROR, TRANSLATION_IS_NOT_SUCCESSFUL, null);
        }
    }

    private String Post(String word) throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,
                "[{\n\t\"Text\": \"" + word + "\"\n}]");
        Request request = new Request.Builder()
                .url(url).post(body)
                .addHeader("Ocp-Apim-Subscription-Key", subscriptionKey)
                .addHeader("Content-type", "application/json")
                .addHeader("Ocp-Apim-Subscription-Region", "westus2")
                .build();
        Response response = client.newCall(request).execute();
        return response.body().string();
    }

    private static String prettify(String json_text) {
        JsonParser parser = new JsonParser();
        JsonElement json = parser.parse(json_text);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(json);
    }

}
