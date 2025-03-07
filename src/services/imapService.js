const Imap = require("imap");
const { simpleParser } = require("mailparser");
const config = require("../config"); 
const { sendMessageToGroup } = require("./whatsappservice");

const imapConfig = {
  user: config.email.user,
  password: config.email.pass,
  host: config.imap.host,
  port: config.imap.port,
  tls: true, 
  keepalive: {
    interval: 9000, // Interval for sending NOOPs or performing keepalive operations
    idleInterval: 200000, // Interval for re-sending IDLE command
    forceNoop: true, // Force use of NOOP keepalive if IDLE is also supported
  },
};

let imap;
let isConnected = false;

const initImapConnection = () => {
  if (imap) return Promise.resolve(imap);

  return new Promise((resolve, reject) => {
    imap = new Imap(imapConfig);

    imap.once("ready", () => {
      isConnected = true;
      console.log("IMAP connection ready");
      resolve(imap);
    });


    imap.once("error", (err) => {
      console.error("IMAP Error:", err);
      isConnected = false;
      setTimeout(initImapConnection, 5000);
      reject(err);
    });

    imap.once("end", () => {
      console.log("IMAP Connection ended");
      isConnected = false;
      setTimeout(initImapConnection, 5000);
    });

    imap.once("close", (hadError) => {
      console.log("IMAP Connection closed", hadError ? "due to error" : "");
      isConnected = false;
      setTimeout(initImapConnection, 5000);
    });

    imap.once("idle", () => {
      console.log("IMAP IDLE command active");
    });
    imap.connect();
  });
};

const openInbox = (callback) => {
  initImapConnection()
    .then((imap) => {
      imap.openBox("INBOX", false, callback);
    })
    .catch((err) => {
      console.error("Error opening inbox:", err);
    });
};

const fetchAllEmails = async () => {
  return new Promise((resolve, reject) => {
    initImapConnection()
      .then((imap) => {
        openInbox((err, box) => {
          if (err) {
            return reject(err);
          }

          const searchCriteria = ["ALL"];
          const fetchOptions = { bodies: "" }; // Fetch entire message

          imap.search(searchCriteria, (err, results) => {
            if (err) {
              return reject(err);
            }

            if (!results.length) {
              return resolve([]);
            }

            const fetch = imap.fetch(results, fetchOptions);

            const emails = [];
            fetch.on("message", (msg, seqno) => {
              msg.on("body", (stream, info) => {
                simpleParser(stream, (err, mail) => {
                  if (err) {
                    return reject(err);
                  }
                  emails.push(mail);
                });
              });
            });

            fetch.on("end", () => {
              resolve(emails);
            });
          });
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const checkEmails = async () => {
  return new Promise((resolve, reject) => {
    initImapConnection()
      .then((imap) => {
        openInbox((err, box) => {
          if (err) {
            return reject(err);
          }

          const searchCriteria = ["UNSEEN"];
          const fetchOptions = {
            bodies: ["HEADER.FIELDS (FROM SUBJECT DATE)", "TEXT"],
            markSeen: true,
          };

          imap.search(searchCriteria, (err, results) => {
            if (err) {
              return reject(err);
            }

            if (!results.length) {
              return resolve([]);
            }

            const fetch = imap.fetch(results, fetchOptions);

            const emails = [];
            fetch.on("message", (msg, seqno) => {
              msg.on("body", (stream, info) => {
                simpleParser(stream, (err, mail) => {
                  if (err) {
                    return reject(err);
                  }
                  emails.push(mail);
                });
              });
            });

            fetch.on("end", () => {
              resolve(emails);
            });
          });
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};


const monitorEmails = () => {
  initImapConnection()
    .then((imap) => {
      openInbox((err, box) => {
        if (err) throw err;
        console.log("Listening for new emails...");

        imap.on("mail", () => {
          // When a new email arrives, fetch the latest email
          const fetchOptions = { bodies: "", markSeen: true };
          const searchCriteria = ["UNSEEN"];

          imap.search(searchCriteria, (err, results) => {
            if (err) throw err;

            if (!results || !results.length) return;

            const fetch = imap.fetch(results, fetchOptions);
            fetch.on("message", (msg, seqno) => {
              msg.on("body", (stream, info) => {
                simpleParser(stream, async (err, mail) => {
                  if (err) throw err;

                  console.log("Parsed Email:", mail);

                  const fromAddress = mail.from.value[0].address;
                  const emailText = mail.text;
                  const lookupAddresses = [
                    "admin@diagnoslab.in",
                    "narayanadiangostic@gmail.com",
                    "yash@diagnopathlabs.in",
                    "instantemail@justdial.com",
                  ];
                  // Check if the email is from the specified address
                  if (lookupAddresses.includes(fromAddress)) {
                    // Extracting the details from the email body
                    const nameMatch = emailText.match(
                      /(?:From:\s*)?([\w\s]+)(?:\s*\[\S+\])?\s*enquired for (.*)/
                    );
                    const enquiryDetailsMatch =
                      emailText.match(/enquired for (.*)\./);
                    const userAreaMatch =
                      emailText.match(/User Area\s*:\s*(.*)/);
                    const userCityMatch =
                      emailText.match(/User City\s*:\s*(.*)/);
                    const userStateMatch = emailText.match(
                      /User State\s*:\s*(.*)/
                    );
                    const searchDateTimeMatch = emailText.match(
                      /Search Date & Time\s*:\s*(.*)/
                    );

                    const extractedData = {
                      name: nameMatch ? nameMatch[1].trim() : "Not found",
                      enquiryDetails: enquiryDetailsMatch
                        ? enquiryDetailsMatch[1]
                        : "Not found",
                      userArea: userAreaMatch ? userAreaMatch[1] : "Not found",
                      userCity: userCityMatch ? userCityMatch[1] : "Not found",
                      userState: userStateMatch
                        ? userStateMatch[1]
                        : "Not found",
                      searchDateTime: searchDateTimeMatch
                        ? searchDateTimeMatch[1]
                        : "Not found",
                    };
                    // // Format the data to be sent to your API
                    // const apiPayload = {
                    //   subject: mail.subject,
                    //   ...extractedData,
                    // };
                    const message = `Dear Team,

We have received a new enquiry.

Name: ${extractedData.name}
Enquiry For: ${extractedData.enquiryDetails}
Area: ${extractedData.userArea}
City: ${extractedData.userCity}
State: ${extractedData.userState}
Search Date & Time: ${extractedData.searchDateTime}`;
                    try {
                      const groupId = "120363312991542668@g.us";
                      await sendMessageToGroup(groupId, message);
                      console.log(
                        "API called successfully for the email from:",
                        fromAddress
                      );
                    } catch (error) {
                      console.log('====================================');
                      console.log(message)
                      console.log('====================================');
                      console.error("Error calling API:", error);
                    }
                  }
                });
              });
            });
          });
        });
      });
    })
    .catch((err) => {
      console.error("Error initializing IMAP connection:", err);
    });
};

const closeConnection = () => {
  if (imap && isConnected) {
    imap.end();
  }
};

process.on("SIGINT", () => {
  closeConnection();
  process.exit();
});

process.on("SIGTERM", () => {
  closeConnection();
  process.exit();
});
monitorEmails();

module.exports = {
  checkEmails,
  fetchAllEmails,
  monitorEmails,
};
