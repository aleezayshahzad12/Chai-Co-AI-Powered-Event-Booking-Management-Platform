const OpenAI = require("openai");

if (!process.env.OPENAI_API_KEY) {
  console.error(": Missing OpenAI API Key");
  process.exit(1);
}

const aiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30000 });

const generateEmailDraft = async (formData, type = "initial") => {
  let prompt = "";

  if (type === "initial") {
    prompt = `Compose a warm confirmation email for a client inquiry to Chai&Co. use the details below to set the tone and compose a apporiaite email.
    details: the cilent is getting the email after filling out the inital event inquiry form. the team will reach out to the cilent with the futher steps.
Use client name: ${formData.name}, Event: ${formData.event}.
Return JSON with keys: subject, body.`;
  } 
  else if (type === "teamNotification") {
    prompt = `Compose an internal alert email for the team about a new inquiry submission.Just alret the team a new form is submitted. 
Client: ${formData.name} (${formData.email}), Event: ${formData.event}, Guests: ${formData.guestSize}.
Return JSON with keys: subject, body.`;
  } 
  else if (type === "approved") {
    prompt = `Compose an approval email for the client. Use the details below to hlep draft the email 
    details about the email is about: Our team carefully evaluates each submission. Those selected receive a confirmation email with an access code, reflecting the dedication and care given to every potential collaboration.
         The access code unlocks the consultation scheduling, giving you a dedicated space to discuss your event in detail. Each appointment is organized to provide focused, meaningful dialogue.

Client: ${formData.name}, access code: ${formData.accessCode}.
Return JSON with keys: subject, body.`;
  } 
  else if (type === "rejected") {
    prompt = `Compose a warm and professional rejection email for the client.
    details: the rejection in this context means that the chai & co at this time will not be able to the cilent. 

Client: ${formData.name}, Event: ${formData.event}.
Return JSON with keys: subject, body.`;
  } 
  else if (type === "bookingConfirmation") {
    prompt = `Compose booking confirmation email for chaiNco.
    details: the email will be sent once the user has shecduled an appointment with Chai & Co. write how excited the team is and Consultations occur over Zoom, allowing us to connect and collaborate closely. From this conversation, we begin a deliberate planning process, ensuring each event receives the attention, creativity, and precision it deserves.
    inform the cilent that the team will apperiaciate if the cilents have any vision/ mood board in mind and bring that to the meeting. 

Client: ${formData.name}, 
Date: ${formData.bookedDate}, 
Time: ${formData.bookedTime}.
Zoom Meeting Link: ${formData.zoomLink}.
Make sure to include the zoom link in the email body.
Return JSON with keys: subject, body.`;
  }

  try {
    const emailGenerated = await aiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert email writer for curated luxury event planning by chai&co." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const raw = emailGenerated.choices[0].message.content;
    console.log("AI raw output:", raw);

    let result;
//ai was not generating the required emails in json and was including texts. in order for the 
//system to function properly the raw data gievn by ai needs to match the accepted json output format for the frontend of the website to handle. 
//data must be parsed to json 
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) 
        {throw new Error("No JSON found in AI output");
        }
      result = JSON.parse(jsonMatch[0]);

      if (result.subject && typeof result.subject.trim === 'function') {
        result.subject = result.subject.trim();
      } else {
        result.subject = "No Subject";
      }
      
      if (result.body && typeof result.body.trim === 'function') {
        result.body = result.body.trim();
      } else {
        result.body = "";
      }
    } catch (err) {
      console.error("failed to parse AI email JSON:", err);
      result = { subject: "No Subject", body: raw };
    }

    return result;
    
  } catch (error) {
    throw new Error(`Failed to generate ${type} email`);
  }
};

module.exports = { generateEmailDraft };
