export const environment = {
  production: true,
  version: "0.0.1",
  server_url: "localhost:5000",
  api_url: "http://topelius-m.sls.fi:8000",
  image_logo: "logo.png",
  selector_configurations: [
    {
      name: "Personer",
      descriptionField: "Karriär",
      sortByColumn: 0,
      elements: [
        "persName", "rs"
      ],
      elementsXPath: "//*[name() = 'persName' or name() = 'rs']",
      attribute: "corresp"
    },
    {
      name: "Platser",
      descriptionField: "Beskrivning",
      sortByColumn: 0,
      elements: [
        "placeName"
      ],
      elementsXPath: "//*[name() = 'placeName']",
      attribute: "corresp"
    }
  ],
  xml_file_extensions: ".xml,.tei,.txt",
  xml_space_before_trailing_slash: true,
  line_break: "\r\n"
};
