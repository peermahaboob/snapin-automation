import { DevrevAPI } from "./api-utils-new";
import { expect, test, request as playwrightRequest } from "@playwright/test";
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const inspect = require("util").inspect;
async function waitForState(
  apiContext,
  connectionName,
  expectedState,
  interval = 5000
) {
  let state = null;
  const devrevAPI = new DevrevAPI(apiContext);
  while (state !== expectedState) {
    await new Promise((resolve) => setTimeout(resolve, interval));
    state = await devrevAPI.getAirdropState(connectionName);
    console.log(`Current state: ${state}. Waiting for "${expectedState}"...`);
    if (state === expectedState) break;
  }
  console.log(`Target state "${expectedState}" reached.`);
}

async function readOtpFromGmail(username, password) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      try {
        if (imap && imap.state !== "disconnected") {
          imap.end();
        }
        reject(new Error("Operation timed out after 30 seconds"));
      } catch (err) {
        console.error("Error during timeout cleanup:", err);
        reject(new Error("Timeout and cleanup failure"));
      }
    }, 30000);

    const imap = new Imap({
      user: username,
      password: password,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000,
    });

    function cleanupAndResolve(result) {
      clearTimeout(timeout);
      if (imap && imap.state !== "disconnected") {
        imap.end();
      }
      resolve(result);
    }

    function cleanupAndReject(error) {
      clearTimeout(timeout);
      if (imap && imap.state !== "disconnected") {
        imap.end();
      }
      reject(error);
    }

    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err, box) => {
        if (err) {
          return cleanupAndReject(err);
        }
        const searchCriteria = [
          ["SINCE", new Date(Date.now() - 5 * 60 * 1000)]
        ];
        
        imap.search(searchCriteria, (err, results) => {
          if (err) {
            return cleanupAndReject(err);
          }

          if (results.length === 0) {
            console.log("No recent messages found");
            return cleanupAndResolve(null);
          }

          console.log(`Found ${results.length} recent messages`);
          const otpEmails = [];
          let messagesChecked = 0;
          
          const fetch = imap.fetch(results, {
            bodies: "",
            markSeen: true,
          });

          fetch.on("message", (msg, seqno) => {
            console.log(`Processing message #${seqno}`);

            msg.on("body", (stream) => {
              let buffer = "";

              stream.on("data", (chunk) => {
                buffer += chunk.toString("utf8");
              });

              stream.once("end", async () => {
                try {
                  const parsed = await simpleParser(buffer);
                  const from = parsed.from?.text || "";
                  const subject = parsed.subject || "";
                  const content = parsed.text || "";
                  const receivedDate = parsed.date ? new Date(parsed.date) : new Date();
                  const currentTime = new Date();
                  const diffInMinutes = (currentTime - receivedDate) / (1000 * 60);

                  console.log(
                    `Message from: ${from}, subject: ${subject}, age: ${diffInMinutes.toFixed(2)} minutes`
                  );
                  if (
                    from.includes("otp@devrev.ai") &&
                    subject.includes("[DevRev] Login verification code") &&
                    diffInMinutes <= 2 
                  ) {
                    const otpMatch = content.match(/Your code is:\s*(\d{6})/);
                    if (otpMatch) {
                      console.log(`Found OTP: ${otpMatch[1]}`);
                      otpEmails.push({
                        otp: otpMatch[1],
                        timestamp: receivedDate,
                        age: diffInMinutes
                      });
                    }
                  }
                } catch (e) {
                  console.error("Error parsing message:", e);
                } finally {
                  messagesChecked++;
                  if (messagesChecked === results.length) {
                    if (otpEmails.length > 0) {
                      otpEmails.sort((a, b) => b.timestamp - a.timestamp);
                      console.log(`Found ${otpEmails.length} OTP emails. Using most recent: ${otpEmails[0].otp}`);
                      cleanupAndResolve(otpEmails[0].otp);
                    } else {
                      console.log("No valid OTP emails found");
                      cleanupAndResolve(null);
                    }
                  }
                }
              });
            });

            msg.once("error", (err) => {
              console.error("Message error:", err);
              messagesChecked++;
              if (messagesChecked === results.length) {
                if (otpEmails.length > 0) {
                  otpEmails.sort((a, b) => b.timestamp - a.timestamp);
                  cleanupAndResolve(otpEmails[0].otp);
                } else {
                  cleanupAndResolve(null);
                }
              }
            });
          });

          fetch.once("error", (err) => {
            console.error("Fetch error:", err);
            cleanupAndReject(err);
          });

          fetch.once("end", () => {
            console.log("Fetch complete");
          });
        });
      });
    });

    imap.once("error", (err) => {
      console.error("IMAP connection error:", err);
      cleanupAndReject(err);
    });

    imap.once("end", () => {
      console.log("IMAP connection ended");
      clearTimeout(timeout);
    });

    imap.once("close", (hadError) => {
      console.log(`IMAP connection closed ${hadError ? "with error" : "normally"}`);
    });

    try {
      console.log("Connecting to IMAP server...");
      imap.connect();
    } catch (err) {
      console.error("Connection attempt failed:", err);
      cleanupAndReject(err);
    }
  });
}

module.exports = { waitForState, readOtpFromGmail };
