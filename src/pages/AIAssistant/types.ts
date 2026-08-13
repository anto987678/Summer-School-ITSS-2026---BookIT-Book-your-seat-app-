export type AssistantStatus =
    | "idle" //just opened
    | "requesting-location" //the browser requests permission for location
    | "loading" //tries to find relevant data about traffic and weather
    | "succes" //the message easgenerated succesfully
    | "error" //the location or the data could not be obtained