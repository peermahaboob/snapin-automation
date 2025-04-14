import { getAirdropState } from "./devrev-api-utils";
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const inspect = require('util').inspect;
async function waitForState(request, connection, expectedState, interval = 5000) {
    let state = null;
    while (state !== expectedState) {
      state = await getAirdropState(request, connection);
      console.log(`Current state: ${state}. Waiting for "${expectedState}"...`);
      if (state === expectedState) break;
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    console.log(`Target state "${expectedState}" reached.`);
  }
  
  async function readOtpFromGmail(username, password) {
    return new Promise((resolve, reject) => {
      // Set a global timeout to prevent hanging
      const timeout = setTimeout(() => {
        try {
          if (imap && imap.state !== 'disconnected') {
            imap.end();
          }
          reject(new Error('Operation timed out after 30 seconds'));
        } catch (err) {
          console.error('Error during timeout cleanup:', err);
          reject(new Error('Timeout and cleanup failure'));
        }
      }, 30000); // 30 second timeout
      
      const imap = new Imap({
        user: username,
        password: password,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 10000 // Add an authentication timeout
      });
      
      let otp = null;
      
      function cleanupAndResolve(result) {
        clearTimeout(timeout);
        if (imap.state !== 'disconnected') {
          imap.end();
        }
        resolve(result);
      }
      
      function cleanupAndReject(error) {
        clearTimeout(timeout);
        if (imap && imap.state !== 'disconnected') {
          imap.end();
        }
        reject(error);
      }
      
      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, box) => { // Changed to false to allow marking seen
          if (err) {
            return cleanupAndReject(err);
          }
          
          // Search for more emails - don't just limit to UNSEEN
          imap.search(['UNSEEN', ['SINCE', new Date(Date.now() - 60 * 1000)]], (err, results) => {
            if (err) {
              return cleanupAndReject(err);
            }
            
            if (results.length === 0) {
              console.log('No unread messages found');
              return cleanupAndResolve(null);
            }
            
            console.log(`Found ${results.length} unread messages`);
            results.reverse(); // Check newest first
            
            let messagesChecked = 0;
            const fetch = imap.fetch(results, {
              bodies: '',
              markSeen: true
            });
            
            fetch.on('message', (msg, seqno) => {
              console.log(`Processing message #${seqno}`);
              
              msg.on('body', (stream) => {
                let buffer = '';
                
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });
                
                stream.once('end', async () => {
                  try {
                    const parsed = await simpleParser(buffer);
                    const from = parsed.from?.text || '';
                    const subject = parsed.subject || '';
                    const content = parsed.text || '';
                    const receivedDate = parsed.date ? new Date(parsed.date) : new Date();
                    const currentTime = new Date();
                    const diffInMinutes = (currentTime - receivedDate) / (1000 * 60);
                    
                    console.log(`Message from: ${from}, subject: ${subject}, age: ${diffInMinutes.toFixed(2)} minutes`);
                    
                    if (
                      from.includes('otp@devrev.ai') &&
                      subject.includes('[DevRev] Login verification code') &&
                      diffInMinutes <= 10 // Increased to 10 minutes instead of 10 seconds
                    ) {
                      const otpMatch = content.match(/Your code is:\s*(\d{6})/);
                      if (otpMatch) {
                        console.log(`Found OTP: ${otpMatch[1]}`);
                        otp = otpMatch[1];
                        return cleanupAndResolve(otp);
                      }
                    }
                  } catch (e) {
                    console.error('Error parsing message:', e);
                  } finally {
                    messagesChecked++;
                    if (messagesChecked === results.length && !otp) {
                      console.log('Checked all messages, no OTP found');
                      cleanupAndResolve(null);
                    }
                  }
                });
              });
              
              msg.once('error', (err) => {
                console.error('Message error:', err);
                messagesChecked++;
                if (messagesChecked === results.length && !otp) {
                  cleanupAndResolve(null);
                }
              });
            });
            
            fetch.once('error', (err) => {
              console.error('Fetch error:', err);
              cleanupAndReject(err);
            });
            
            fetch.once('end', () => {
              console.log('Fetch complete');
              if (!otp) {
                cleanupAndResolve(null);
              }
            });
          });
        });
      });
      
      imap.once('error', (err) => {
        console.error('IMAP connection error:', err);
        cleanupAndReject(err);
      });
      
      imap.once('end', () => {
        console.log('IMAP connection ended');
        clearTimeout(timeout);
      });
      
      // Add more event handlers for better debugging
      imap.once('close', (hadError) => {
        console.log(`IMAP connection closed ${hadError ? 'with error' : 'normally'}`);
      });
      
      try {
        console.log('Connecting to IMAP server...');
        imap.connect();
      } catch (err) {
        console.error('Connection attempt failed:', err);
        cleanupAndReject(err);
      }
    });
  }

  module.exports={waitForState,readOtpFromGmail}