const express = require('express');
const QRCode = require('qrcode');
const gifted = require('gifted-dls');
const googleTTS = require('google-tts-api');
const javascriptObfuscator = require('javascript-obfuscator');
const axios = require('axios');
const cheerio = require('cheerio');
const { igStalk } = require('api-stalkerr');
const fetch = require('node-fetch');
const { ytmp3, ytmp4 } = require('nothing-yt');
const ytdl = require('ytdl-core');
const { search, download } = require('aptoide-scraper');
const ytSearch = require('yt-search');
const figlet = require('figlet');
const { chromium } = require('playwright');
const { alldl } = require('rahad-all-downloader'); // اضافه کردن کتابخانه
const { igdl } = require('ben-dls');
const { ttdl } = require('ben-dls');
const { fbdown } = require('ben-dls');
const { youtube } = require('ben-dls');
const { twitter } = require('ben-dls');
const fg = require('api-dylux'); //
const fs = require('fs');
const os = require('os');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const timeLimit = 7 * 24 * 60 * 60 * 1000;
const apiKeyFile = path.join(__dirname, 'apikeyall.json');
const visitorFile = 'visitors.json';
const visitorFilee = 'count.json';

// خواندن تعداد بازدیدکنندگان از فایل
const getVisitorCount = () => {
  try {
    const data = fs.readFileSync(visitorFile);
    const parsedData = JSON.parse(data);
    return parsedData.visitors || 0;
  } catch (err) {
    console.error('Error reading file', err);
    return 0;
  }
};

const getVisitorCounte = () => {
  try {
    const data = fs.readFileSync(visitorFilee);
    const parsedData = JSON.parse(data);
    return parsedData.visitors || 0;
  } catch (err) {
    console.error('Error reading file', err);
    return 0;
  }
};

// افزایش تعداد بازدیدکنندگان
const incrementVisitorCount = () => {
  let count = getVisitorCount();
  count += 1500; // افزایش 1 واحد (برای هر بازدید)
  fs.writeFileSync(visitorFile, JSON.stringify({ visitors: count }, null, 2));
  return count;
};
// DOC API
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/changelog', (req, res) => {
    res.sendFile(path.join(__dirname, 'Updates.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});
app.get('/doc', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs.html'));
});
app.get('/ai', (req, res) => {
    res.sendFile(path.join(__dirname, 'ai.html'));
});
app.get('/download', (req, res) => {
    res.sendFile(path.join(__dirname, 'download.html'));
});
app.get('/tools', (req, res) => {
    res.sendFile(path.join(__dirname, 'tools.html'));
});
// مسیر بررسی وضعیت API
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'search.html'));
});
app.get('/converter', (req, res) => {
    res.sendFile(path.join(__dirname, 'converter.html'));
});
app.get('/shortener', (req, res) => {
    res.sendFile(path.join(__dirname, 'shortener.html'));
});
app.get('/nsfw', (req, res) => {
    res.sendFile(path.join(__dirname, 'nsfw.html'));
});
app.get('/maker', (req, res) => {
    res.sendFile(path.join(__dirname, 'maker.html'));
});
app.get('/stalk', (req, res) => {
    res.sendFile(path.join(__dirname, 'stalk.html'));
});
app.get('/movie', (req, res) => {
    res.sendFile(path.join(__dirname, 'movie.html'));
});
app.get('/islam', (req, res) => {
    res.sendFile(path.join(__dirname, 'islam.html'));
});
app.get('/uploader', (req, res) => {
    res.sendFile(path.join(__dirname, 'uploader.html'));
});
// API برای دریافت تعداد بازدیدکنندگان
app.get('/visit', (req, res) => {
  const visitors = getVisitorCount();
  res.json({ visitors });
});
app.get('/count', (req, res) => {
  const visitors = getVisitorCounte();
  res.json({ visitors });
});

// API برای افزایش تعداد بازدیدکنندگان
app.get('/increment-visit', (req, res) => {
  const visitors = incrementVisitorCount();
  res.json({ visitors });
});
setInterval(() => {
  let count = getVisitorCount();
  count += 10; // افزایش 10 واحد
  fs.writeFileSync(visitorFile, JSON.stringify({ visitors: count }, null, 2));
  console.log(`Visitor count increased to: ${count}`);
}, 60000); // هر 60,000 میلی‌ثانیه (1 دقیقه)
// تابع برای محاسبه زمان اجرای سرور
const getUptime = () => {
  const seconds = Math.floor(process.uptime());
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours} hours, ${minutes} minutes, ${remainingSeconds} second`;
};

// تابع برای دریافت استفاده از حافظه
const getMemoryUsage = () => {
  const totalMemory = 7628
  const usedMemory = process.memoryUsage().rss / (1024 * 1024); // مگابایت
  return `${usedMemory.toFixed(2)}MB / ${totalMemory.toFixed(2)}GB`;
};

// API برای وضعیت
app.get('/status', (req, res) => {
  res.json({
    runtime: getUptime(),
    memory: getMemoryUsage(),
  });
});
//MAIN
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// کلید پیش‌فرض
const defaultKey = {
    "nothing-api": { limit: 100000000, used: 0, lastReset: Date.now() }
};

// بارگذاری کلیدها از فایل
const loadApiKeys = () => {
    if (!fs.existsSync(apiKeyFile)) {
        fs.writeFileSync(apiKeyFile, JSON.stringify(defaultKey, null, 2)); // ایجاد فایل در صورت عدم وجود
    }
    return JSON.parse(fs.readFileSync(apiKeyFile));
};

// ذخیره کلیدها در فایل
const saveApiKeys = (apiKeys) => {
    fs.writeFileSync(apiKeyFile, JSON.stringify(apiKeys, null, 2));
};

let apiKeys = loadApiKeys();

// تابع بررسی یا ایجاد وضعیت برای کاربر
const checkUserLimit = (apikey) => {
    const apiKeyData = apiKeys[apikey];
    
    // اگر زمان بازنشانی گذشته باشد، مقدار `used` صفر می‌شود
    if (Date.now() - apiKeyData.lastReset > timeLimit) {
        apiKeyData.used = 0;
        apiKeyData.lastReset = Date.now();
    }

    return apiKeyData;
};
// مسیر بررسی وضعیت API
app.get('/api/checker', (req, res) => {
    const apikey = req.query.apikey;

    if (!apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            result: 'Invalid or missing API key.'
        });
    }

    const keyData = apiKeys[apikey];
    const remaining = keyData.limit - keyData.used;

    res.json({
        status: true,
        apikey,
        limit: keyData.limit,
        used: keyData.used,
        remaining,
        resetIn: '7 days'
    });
});
// مسیر ایجاد کلید API جدید
app.get('/api/create-apikey', (req, res) => {
    const newKey = req.query.key;
    if (!newKey || apiKeys[newKey]) {
        return res.status(400).json({
            status: false,
            result: 'Invalid or duplicate key.'
        });
    }

    apiKeys[newKey] = { limit: 200, used: 0, lastReset: Date.now(), users: {} };
    saveApiKeys(apiKeys);

    res.json({
        status: true,
        result: 'New API key created.',
        newKey,
        limit: 200
    });
});

// مسیر تغییر محدودیت کلید API
app.get('/api/apikeychange/upto', (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API از درخواست
    const newLimit = parseInt(req.query.limit); // دریافت محدودیت جدید از درخواست

    // بررسی مقدار ورودی
    if (!apikey || !apiKeys[apikey]) {
        return res.status(400).json({
            status: false,
            result: 'Invalid or missing API key.'
        });
    }

    if (!newLimit || isNaN(newLimit) || newLimit <= 0) {
        return res.status(400).json({
            status: false,
            result: 'Invalid limit value.'
        });
    }

    // به‌روزرسانی محدودیت کلید API
    apiKeys[apikey].limit = newLimit;
    saveApiKeys(apiKeys); // ذخیره تغییرات در فایل

    res.json({
        status: true,
        result: 'API key limit updated successfully.',
        apikey: apikey,
        newLimit: newLimit
    });
});
//DISABLE APIKEY
app.get('/api/apikeychange/disable', (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API از درخواست

    // بررسی صحت کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(400).json(JSON.stringify({
            status: false,
            result: 'Invalid or missing API key.'
        }));
    }

    // غیرفعال کردن کلید API
    apiKeys[apikey].active = false;
    saveApiKeys(apiKeys); // ذخیره تغییرات در فایل

    res.json(JSON.stringify({
        status: true,
        result: `API key ${apikey} has been disabled.`,
        apikey
    }));
});

// فعال کردن مجدد کلید API
app.get('/api/apikeychange/enable', (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API از درخواست

    // بررسی صحت کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(400).json(JSON.stringify({
            status: false,
            result: 'Invalid or missing API key.'
        }));
    }

    // فعال کردن مجدد کلید API
    apiKeys[apikey].active = true;
    saveApiKeys(apiKeys); // ذخیره تغییرات در فایل

    res.json(JSON.stringify({
        status: true,
        result: `API key ${apikey} has been enabled.`,
        apikey
    }));
});
// حذف کلید API
app.get('/api/apikeychange/delete', (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API از درخواست

    // بررسی صحت کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(400).json(JSON.stringify({
            status: false,
            result: 'Invalid or missing API key.'
        }));
    }

    // حذف کلید API از سیستم
    delete apiKeys[apikey];
    saveApiKeys(apiKeys); // ذخیره تغییرات در فایل

    res.json(JSON.stringify({
        status: true,
        result: `API key ${apikey} has been deleted.`,
        apikey
    }));
});

// ریست کردن آمار کلید API
app.get('/api/apikeychange/reset', (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API از درخواست

    // بررسی صحت کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(400).json(JSON.stringify({
            status: false,
            result: 'Invalid or missing API key.'
        }));
    }

    // ریست کردن آمار کلید API
    apiKeys[apikey].used = 0;
    apiKeys[apikey].lastReset = Date.now(); // زمان آخرین ریست را به‌روز می‌کند
    saveApiKeys(apiKeys); // ذخیره تغییرات در فایل

    res.json(JSON.stringify({
        status: true,
        result: `API key ${apikey} has been reset.`,
        apikey
    }));
});
//TEMP MAIL
const tempEmails = [];
app.get('/api/tools/tempmail', async (req, res) => {
    const apikey = req.query.apikey; // دریافت API Key از درخواست

    // بررسی وجود API Key در لیست
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.',
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت‌های کاربر

    // بررسی استفاده از محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.',
        });
    }

    // افزایش مقدار `used` برای کلید و ذخیره‌سازی
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // تولید ایمیل
        const response = await axios.get('https://www.1secmail.com/api/v1/?action=genRandomMailbox');
        const email = response.data[0];
        
        // ذخیره ایمیل در متغیر
        tempEmails.push(email);

        // بازگشت ایمیل تولید شده
        const result = {
            type: 'email',
            apikey: apikey,
            email: email,
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: result,
        }, null, 2)); // مرتب کردن JSON با فاصله 4
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error creating temporary email.',
            error: error.message,
        });
    }
});
// مسیر برای بررسی Inbox ایمیل
app.get('/api/tools/tempmail-inbox', async (req, res) => {
    const apikey = req.query.apikey; // دریافت API Key از درخواست
    const email = req.query.inbox;  // ایمیل موردنظر برای بررسی

    // بررسی وجود API Key
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.',
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت‌های کاربر

    // بررسی استفاده از محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.',
        });
    }

    // بررسی وجود ایمیل
    if (!email) {
        return res.status(400).json({
            status: false,
            message: 'Inbox email is required.',
        });
    }

    // بررسی اینکه آیا ایمیل قبلاً ایجاد شده است
    if (!tempEmails.includes(email)) {
        return res.status(404).json({
            status: false,
            message: 'Email not found. Make sure to create it first.',
        });
    }

    // افزایش مقدار `used` برای کلید و ذخیره‌سازی
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        const [login, domain] = email.split('@');

        // دریافت پیام‌های Inbox
        const response = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
        const messages = response.data;

        // ساختار پاسخ
        const result = {
            type: 'inbox',
            apikey: apikey,
            email: email,
            messages: messages.length > 0 ? messages : 'Inbox is empty.',
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: result,
        }, null, 2)); // مرتب کردن JSON با فاصله 4
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error checking inbox.',
            error: error.message,
        });
    }
});
//TEXT TO SPECH
app.get('/api/tools/text-to-speech', async (req, res) => {
  const apikey = req.query.apikey;  // دریافت کلید API
  const text = req.query.text;      // دریافت متن
  const lang = req.query.lang || 'en';  // زبان پیش‌فرض 'en'

  // بررسی کلید API
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or missing API key.',
    });
  }

  const keyData = checkUserLimit(apikey); // بررسی محدودیت‌های کاربر

  // بررسی استفاده از محدودیت
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      message: 'API key usage limit exceeded.',
    });
  }

  // بررسی ارسال متن
  if (!text) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Text query parameter is required.'
    });
  }

  // افزایش مقدار استفاده و ذخیره
  keyData.used += 1;
  saveApiKeys(apiKeys);

  // تبدیل متن به URL صدای گفتاری با زبان انتخابی
  const url = googleTTS.getAudioUrl(text, {
    lang: lang,
    slow: false,
    host: 'https://translate.google.com',
  });

  try {
    // درخواست به TinyURL برای کوتاه کردن URL
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);

    // ارسال پاسخ JSON با لینک کوتاه‌شده به عنوان download_url
    res.json({
      status: true,
      creator: 'Nothing-Ben',
      result: {
        type: "audio",
        apikey: apikey,
        download_url: response.data  // لینک کوتاه‌شده به جای URL اصلی
      }
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error shortening URL with TinyURL',
      error: err.message
    });
  }
});
//TEXT TO SPECH V2
app.get('/api/tools/text-to-speechV2', async (req, res) => {
  const apikey = req.query.apikey;  // دریافت کلید API
  const text = req.query.text;      // دریافت متن
  const lang = req.query.lang || 'en';  // زبان پیش‌فرض 'en'

  // بررسی کلید API
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or missing API key.',
    });
  }

  const keyData = checkUserLimit(apikey); // بررسی محدودیت‌های کاربر

  // بررسی استفاده از محدودیت
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      message: 'API key usage limit exceeded.',
    });
  }

  // بررسی ارسال متن
  if (!text) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Text query parameter is required.'
    });
  }

  // افزایش مقدار استفاده و ذخیره
  keyData.used += 1;
  saveApiKeys(apiKeys);

  // تبدیل متن به URL صدای گفتاری با زبان انتخابی
  const url = googleTTS.getAudioUrl(text, {
    lang: lang,
    slow: false,
    host: 'https://translate.google.com',
  });

  try {
    // درخواست به TinyURL برای کوتاه کردن URL
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);

    // ارسال فایل MP3 به صورت پخش آنلاین
    axios.get(url, { responseType: 'arraybuffer' })
      .then(mp3Response => {
        res.set('Content-Type', 'audio/mpeg');
        res.set('Content-Disposition', 'inline; filename="speech.mp3"');
        res.send(mp3Response.data);
      })
      .catch(error => {
        res.status(500).json({
          status: false,
          creator: 'Nothing-Ben',
          result: 'Error fetching MP3 file',
          error: error.message
        });
      });
  } catch (err) {
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error shortening URL with TinyURL',
      error: err.message
    });
  }
});
// دانلود فایل apikeyall.json
app.get('/api/getsession2', (req, res) => {
    const filePath = path.join(__dirname, 'apikeyall.json'); // تعیین مسیر فایل
    res.download(filePath, 'apikeyall.json', (err) => {
        if (err) {
            res.status(500).json(JSON.stringify({
                status: false,
                result: 'Error downloading file.',
                error: err.result
            }));
        }
    });
});
app.get('/api/getsession3', (req, res) => {
    const filePath = path.join(__dirname, 'shortlinks.json'); // تعیین مسیر فایل
    res.download(filePath, 'shortlinks.json', (err) => {
        if (err) {
            res.status(500).json(JSON.stringify({
                status: false,
                result: 'Error downloading file.',
                error: err.result
            }));
        }
    });
});
app.get('/api/getsession4', (req, res) => {
    const filePath = path.join(__dirname, 'shortlinks.json'); // تعیین مسیر فایل
    res.download(filePath, 'index.json', (err) => {
        if (err) {
            res.status(500).json(JSON.stringify({
                status: false,
                result: 'Error downloading file.',
                error: err.result
            }));
        }
    });
});
// مسیر برای دریافت تمام API keyها
app.get('/api/checkallapikey/check', (req, res) => {
    try {
        // خواندن فایل و دریافت کلیدها
        const apiKeysData = JSON.parse(fs.readFileSync(apiKeyFile));

        // قالب‌بندی اطلاعات
        const allKeys = Object.entries(apiKeysData).map(([key, value]) => ({
            apikey: key,
            limit: value.limit,
            used: value.used,
            remaining: value.limit - value.used,
            lastReset: new Date(value.lastReset).toLocaleString()
        }));

        // ارسال پاسخ به صورت مرتب شده
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: allKeys
        }, null, 2)); // مرتب کردن JSON با فاصله 4
    } catch (err) {
        res.status(500).json({
            status: false,
            result: 'Error reading API keys file.',
            error: err.message
        });
    }
});
//ALL DL
app.get('/api/downloader/alldl', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const videoUrl = req.query.url; // دریافت لینک ویدیو

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت کلید API
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }

    // بررسی وجود لینک ویدیو
    if (!videoUrl) {
        return res.status(400).json({
            status: false,
            message: 'No video URL provided.'
        });
    }

    try {
        // افزایش مقدار استفاده از کلید
        keyData.used += 1;
        saveApiKeys(apiKeys);

        // دریافت اطلاعات ویدیو از API
        const result = await alldl(videoUrl);
        const videoData = result.data;

        // کوتاه کردن لینک دانلود با TinyURL
        const tinyUrlResponse = await axios.get(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(videoData.videoUrl)}`
        );
        const tinyDownloadUrl = tinyUrlResponse.data;

        // ساختار JSON خروجی
        const video = {
            type: "video",
            apikey: apikey, // کلید API
            quality: "480p", // کیفیت پیش‌فرض
            title: videoData.title || "No Title Available",
            url: videoUrl, // لینک اصلی ویدیو
            download_url: tinyDownloadUrl // لینک کوتاه‌شده
        };

        // ارسال پاسخ JSON با استفاده از JSON.stringify و مرتب کردن داده‌ها
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: "Nothing-Ben",
            result: [video]
        }, null, 2)); // مرتب کردن JSON با فاصله 4

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Error processing your request.",
            error: err.message
        });
    }
});
//FBDL
app.get('/api/downloader/facebook', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const { url } = req.query;

    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: "nothing-ben",
            message: 'Invalid or missing API key.'
        });
    }
    
    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }
    
    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: "nothing-ben",
            message: 'API key usage limit exceeded.'
        });
    }
    
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // فرض بر این است که تابع fbdown برای گرفتن ویدیو از URL فیسبوک نوشته شده است
        const video = await fbdown(url);

        // ارسال درخواست به TinyURL برای لینک‌های Normal_video و HD
        const normalVideoTinyUrlResponse = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(video.Normal_video)}`);
        const hdVideoTinyUrlResponse = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(video.HD)}`);

        // دریافت لینک‌های کوتاه‌شده
        const normalVideoTinyUrl = normalVideoTinyUrlResponse.data;
        const hdVideoTinyUrl = hdVideoTinyUrlResponse.data;

        // ساختار JSON خروجی با استفاده از JSON.stringify
        const result = {
            type: 'video',
            apikey: apikey,
            sd_url: normalVideoTinyUrl,  // لینک کوتاه‌شده ویدیو Normal
            hd_url: hdVideoTinyUrl  // لینک کوتاه‌شده ویدیو HD
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'nothing-ben',
            result: [result]
        }, null, 2)); // JSON مرتب با فاصله 4

    } catch (error) {
        res.status(500).send({
            status: false,
            creator: "nothing-ben",
            error: 'Failed to download video'
        });
    }
});
app.get('/api/downloader/wallpaper', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const { text } = req.query; // دریافت پارامتر 'text'

    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }
    
    if (!text) { // بررسی وجود پارامتر 'text'
        return res.status(400).json({ error: 'Text is required' });
    }
    
    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }
    
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        const video = await wallpaper(text); // فرض بر این است که تابع wallpaper تعریف شده است
        res.json({ video });
    } catch (error) {
        res.status(500).json({ error: 'Failed to download wallpaper' });
    }
});
app.get('/api/downloader/twitter', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const { url } = req.query;

    // بررسی صحت کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: "nothing-ben",
            message: 'Invalid or missing API key.'
        });
    }

    // بررسی وجود URL
    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت استفاده از کلید API
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: "nothing-ben",
            message: 'API key usage limit exceeded.'
        });
    }

    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // فرض بر این است که تابع twitter برای گرفتن ویدیو از URL توییتر نوشته شده است
        const video = await twitter(url); 

        // ساختار JSON خروجی با استفاده از JSON.stringify
        const result = {
            type: 'video',
            apikey: apikey,
            title: video.title,
            sd_url: video.url[0].sd,
            download_url: video.url[0].hd
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'nothing-ben',
            result: [result]
        }, null, 2)); // JSON مرتب با فاصله 4

    } catch (error) {
        res.status(500).send({
            status: false,
            creator: "nothing-ben",
            error: 'Failed to download video'
        });
    }
});
//OBFUSCATOR
app.get('/api/tools/encrypt', (req, res) => {
    const { text, apikey } = req.query;

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: "nothing-ben",
            message: "Invalid or missing API key."
        });
    }

    const keyData = checkUserLimit(apikey);

    // بررسی محدودیت استفاده
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: "nothing-ben",
            message: "Limit exceeded for this key."
        });
    }

    // بررسی وجود متن
    if (!text) {
        return res.status(400).json({
            creator: "nothing-ben",
            status: 400,
            success: false,
            message: "Text parameter is required."
        });
    }

    // افزایش مقدار استفاده از کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // Obfuscate کردن متن
        const obfuscatedCode = javascriptObfuscator.obfuscate(text).getObfuscatedCode();

        // ارسال پاسخ JSON با افزودن type و apikey
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: "nothing-ben",
            result: [
                {
                    type: "encrypt-code",
                    apikey: apikey,
                    encrypted_code: obfuscatedCode
                }
            ]
        }, null, 2));
    } catch (error) {
        // مدیریت خطا برای فرآیند Obfuscate
        console.error(error);
        res.status(500).json({
            creator: "nothing-ben",
            status: 500,
            success: false,
            message: "Failed to obfuscate code.",
            error: error.message
        });
    }
});
//TRANSLATE
app.get('/api/tools/translate', async (req, res) => {
    const { text, lang, apikey } = req.query;  // دریافت متن و زبان و API Key

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: "nothing-ben",
            message: "Invalid or missing API key."
        });
    }

    const keyData = checkUserLimit(apikey);

    // بررسی محدودیت استفاده
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: "nothing-ben",
            message: "Limit exceeded for this key."
        });
    }

    // بررسی وجود متن
    if (!text) {
        return res.status(400).json({
            creator: "nothing-ben",
            status: 400,
            success: false,
            message: "Text parameter is required."
        });
    }

    // افزایش مقدار استفاده از کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    // زبان پیش‌فرض "en" در صورتی که زبان مقصد مشخص نشده باشد
    const targetLang = lang || 'en';

    try {
        // ارسال درخواست به API ترجمه گوگل
        const translateApiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const translateResponse = await fetch(translateApiUrl);
        const translateData = await translateResponse.json();

        if (translateData && translateData[0] && translateData[0][0] && translateData[0][0][0]) {
            const translatedText = translateData[0][0][0];

            // ارسال پاسخ ترجمه‌شده به صورت JSON همراه با type و apikey
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                status: true,
                creator: "nothing-ben",
                result: [
                    {
                        type: "translation",
                        apikey: apikey,
                        original_text: text,
                        translated_text: translatedText,
                        language: targetLang
                    }
                ]
            }, null, 2));
        } else {
            return res.status(500).json({ error: 'Failed to translate text' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to translate text' });
    }
});
//TEXT TO IMAGE
app.get('/api/tools/text-to-image', async (req, res) => {
  const { text, apikey } = req.query;  // دریافت متن و API Key از Query

  // بررسی کلید API
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: "nothing-ben",
      message: "Invalid or missing API key."
    });
  }

  const keyData = checkUserLimit(apikey);

  // بررسی محدودیت استفاده
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: "nothing-ben",
      message: "Limit exceeded for this key."
    });
  }

  // بررسی وجود متن
  if (!text) {
    return res.status(400).json({
      creator: "nothing-ben",
      status: 400,
      success: false,
      message: "No text provided."
    });
  }

  // افزایش مقدار استفاده از کلید
  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // درخواست به API Pollinations برای دریافت تصویر با استفاده از URL صحیح
    const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer' // برای دریافت تصویر به‌صورت باینری
    });

    // جلوگیری از کش شدن پاسخ
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    // ارسال تصویر به‌صورت پاسخ
    res.set('Content-Type', 'image/jpeg');
    res.send(response.data); // ارسال داده‌های تصویری

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: true,
      creator: "nothing-ben",
      message: "Failed to generate image."
    });
  }
});
//APK SEARCH
app.get('/api/search/apk-search', async (req, res) => {
  const { text, apikey } = req.query; // دریافت پارامتر جستجو و API Key

  // بررسی کلید API
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  // بررسی محدودیت استفاده
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'Limit exceeded for this key.'
    });
  }

  // بررسی وجود متن
  if (!text) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'text parameter is required.'
    });
  }

  // افزایش مقدار استفاده از کلید
  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // مرحله اول: جستجوی اپلیکیشن
    const searchResponse = await axios.get(`https://bk9.fun/search/apk?q=${encodeURIComponent(text)}`);
    if (!searchResponse.data.BK9 || searchResponse.data.BK9.length === 0) {
      return res.status(404).json({
        status: false,
        creator: 'Nothing-Ben',
        message: 'No results found.'
      });
    }

    // انتخاب اولین نتیجه از جستجو
    const firstResult = searchResponse.data.BK9[0];
    const appId = firstResult.id;

    // مرحله دوم: دریافت لینک دانلود
    const downloadResponse = await axios.get(`https://bk9.fun/download/apk?id=${appId}`);
    if (!downloadResponse.data.BK9) {
      return res.status(404).json({
        status: false,
        creator: 'Nothing-Ben',
        message: 'Download link not found.'
      });
    }

    const appData = downloadResponse.data.BK9;

    // ساخت پاسخ JSON
    const responseData = {
      status: true,
      creator: 'Nothing-Ben',
      result: [
      {
        type: 'apk',
        apikey: apikey, // اضافه کردن API Key به پاسخ
        name: appData.name,
        lastup: appData.lastup,
        package: appData.package,
        thumbnail: appData.icon
      }
      ]
    };

    // تنظیم هدر و ارسال JSON
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(responseData, null, 2)); // ارسال پاسخ به شکل مرتب
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'Internal server error.'
    });
  }
});
//APK DOWNLOAD LINK
app.get('/api/downloader/apkdl', async (req, res) => {
  const { text, apikey } = req.query; // دریافت پارامتر جستجو و API Key

  // بررسی کلید API
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  // بررسی محدودیت استفاده
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'Limit exceeded for this key.'
    });
  }

  // بررسی وجود متن
  if (!text) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'text parameter is required.'
    });
  }

  // افزایش مقدار استفاده از کلید
  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // مرحله اول: جستجوی اپلیکیشن
    const searchResponse = await axios.get(`https://bk9.fun/search/apk?q=${encodeURIComponent(text)}`);
    if (!searchResponse.data.BK9 || searchResponse.data.BK9.length === 0) {
      return res.status(404).json({
        status: false,
        creator: 'Nothing-Ben',
        message: 'No results found.'
      });
    }

    // انتخاب اولین نتیجه از جستجو
    const firstResult = searchResponse.data.BK9[0];
    const appId = firstResult.id;

    // مرحله دوم: دریافت لینک دانلود
    const downloadResponse = await axios.get(`https://bk9.fun/download/apk?id=${appId}`);
    if (!downloadResponse.data.BK9) {
      return res.status(404).json({
        status: false,
        creator: 'Nothing-Ben',
        message: 'Download link not found.'
      });
    }

    const appData = downloadResponse.data.BK9;

    // ساخت پاسخ JSON
    const responseData = {
      status: true,
      creator: 'Nothing-Ben',
      result: [
      {
        type: 'apk',
        apikey: apikey, // اضافه کردن API Key به پاسخ
        name: appData.name,
        lastup: appData.lastup,
        package: appData.package,
        thumbnail: appData.icon,
        download_url: appData.dllink
      }
      ]
    };

    // تنظیم هدر و ارسال JSON
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(responseData, null, 2)); // ارسال پاسخ به شکل مرتب
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'Internal server error.'
    });
  }
});
// DOWNLOAD DLMP3 QUALITY
app.get('/api/downloader/dlmp3', async (req, res) => {
  const apikey = req.query.apikey;  // دریافت کلید API
  const url = req.query.url;
  const quality = req.query.quality; // دریافت کیفیت از URL یا پیش‌فرض به 128

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or missing API key.',
    });
  }

  const keyData = checkUserLimit(apikey); // بررسی محدودیت‌های کاربر

  // بررسی استفاده از محدودیت
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      message: 'API key usage limit exceeded.',
    });
  }
  
  if (!url) {
    return res.status(400).json({ status: false, result: 'No URL provided.' });
  }
  
  keyData.used += 1;
  saveApiKeys(apiKeys);
  
  try {
    const result = await ytmp3(url, quality);
    
    if (result.status) {
      const response = {
        status: true,
        creator: "Nothing-Ben",
        result: {
          type: "audio",
          quality: `${quality}kbps`,
          title: result.metadata.title,
          thumbnail: result.metadata.thumbnail,
          download_url: result.download.url
        }
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(response, null, 2));  // Pretty-print JSON with indentation
    } else {
      return res.status(500).json({ status: false, result: result.result });
    }
  } catch (error) {
    return res.status(500).json({ status: false, result: 'Error processing request.', error: error.message });
  }
});
// DOWNLOAD DLMP4 QUALITY
app.get('/api/downloader/dlmp4', async (req, res) => {
  const apikey = req.query.apikey;  // دریافت کلید API
  const url = req.query.url;
  const quality = req.query.quality; // دریافت کیفیت از URL یا پیش‌فرض به 720

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or missing API key.',
    });
  }

  const keyData = checkUserLimit(apikey); // بررسی محدودیت‌های کاربر

  // بررسی استفاده از محدودیت
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      message: 'API key usage limit exceeded.',
    });
  }
  
  if (!url) {
    return res.status(400).json({ status: false, result: 'No URL provided.' });
  }

  keyData.used += 1;
  saveApiKeys(apiKeys);
  
  try {
    const result = await ytmp4(url, quality);

    if (result.status) {
      const response = {
        status: true,
        creator: "Nothing-Ben",
        result: {
          type: "video",
          quality: `${quality}p`,
          title: result.metadata.title,
          thumbnail: result.metadata.thumbnail,
          download_url: result.download.url
        }
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(response, null, 2));  // Pretty-print JSON with indentation
    } else {
      return res.status(500).json({ status: false, result: result.result });
    }
  } catch (error) {
    return res.status(500).json({ status: false, result: 'Error processing request.', error: error.message });
  }
});
// DOWNLOAD DLMP3
app.get('/api/downloader/dlmp3', async (req, res) => {
  const apikey = req.query.apikey;  // دریافت کلید API
  const url = req.query.url;
  
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or missing API key.',
    });
  }

  const keyData = checkUserLimit(apikey); // بررسی محدودیت‌های کاربر

  // بررسی استفاده از محدودیت
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      message: 'API key usage limit exceeded.',
    });
  }
  
  if (!url) {
    return res.status(400).json({ status: false, result: 'No URL provided.' });
  }
  
  keyData.used += 1;
  saveApiKeys(apiKeys);
  
  try {
    const quality = "128"; // کیفیت دلخواه
    const result = await ytmp3(url, quality);
    
    if (result.status) {
      const response = {
        status: true,
        creator: "Nothing-Ben",
        result: [
        {
          type: "audio",
          quality: "128kbps",
          title: result.metadata.title,
          thumbnail: result.metadata.thumbnail,
          download_url: result.download.url
        }
        ]
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(response, null, 2));  // Pretty-print JSON with indentation
    } else {
      return res.status(500).json({ status: false, result: result.result });
    }
  } catch (error) {
    return res.status(500).json({ status: false, result: 'Error processing request.', error: error.message });
  }
});

// DOWNLOAD DLMP4
app.get('/api/downloader/dlmp4', async (req, res) => {
  const apikey = req.query.apikey;  // دریافت کلید API
  const url = req.query.url;

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or missing API key.',
    });
  }

  const keyData = checkUserLimit(apikey); // بررسی محدودیت‌های کاربر

  // بررسی استفاده از محدودیت
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      message: 'API key usage limit exceeded.',
    });
  }
  
  if (!url) {
    return res.status(400).json({ status: false, result: 'No URL provided.' });
  }

  keyData.used += 1;
  saveApiKeys(apiKeys);
  
  try {
    const quality = "720"; // کیفیت دلخواه
    const result = await ytmp4(url, quality);

    if (result.status) {
      const response = {
        status: true,
        creator: "Nothing-Ben",
        result: [
        {
          type: "video",
          quality: "720p",
          title: result.metadata.title,
          thumbnail: result.metadata.thumbnail,
          download_url: result.download.url
        }
        ]
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(response, null, 2));  // Pretty-print JSON with indentation
    } else {
      return res.status(500).json({ status: false, result: result.result });
    }
  } catch (error) {
    return res.status(500).json({ status: false, result: 'Error processing request.', error: error.message });
  }
});
//DBASE
app.get('/api/tools/dbase', (req, res) => {
    const { text: base64Text, apikey } = req.query;

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: "nothing-ben",
            message: "Invalid or missing API key."
        });
    }

    const keyData = checkUserLimit(apikey);

    // بررسی محدودیت استفاده
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: "nothing-ben",
            message: "Limit exceeded for this key."
        });
    }

    // بررسی وجود متن
    if (!base64Text) {
        return res.status(400).json({
            status: true,
            creator: "nothing-ben",
            message: "Base64 text parameter is required."
        });
    }

    // افزایش مقدار استفاده از کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // Decode متن از Base64
        const decodedText = Buffer.from(base64Text, 'base64').toString('utf-8');

        // ارسال پاسخ JSON با افزودن type و apikey
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: "nothing-ben",
            result: [
                {
                    type: "decode-base64",
                    apikey: apikey,
                    decoded_text: decodedText
                }
            ]
        }, null, 2));
    } catch (error) {
        // مدیریت خطا برای ورودی نامعتبر Base64
        res.status(400).json({
            status: true,
            creator: "nothing-ben",
            message: "Invalid base64 encoding.",
            error: error.message
        });
    }
});
//EBASE
app.get('/api/tools/ebase', (req, res) => {
    const { text, apikey } = req.query;

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: "nothing-ben",
            message: "Invalid or missing API key."
        });
    }

    const keyData = checkUserLimit(apikey);

    // بررسی محدودیت استفاده
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: "nothing-ben",
            message: "Limit exceeded for this key."
        });
    }

    // بررسی وجود متن
    if (!text) {
        return res.status(400).json({
            creator: "nothing-ben",
            status: 400,
            success: false,
            message: "Text parameter is required."
        });
    }

    // افزایش مقدار استفاده از کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // Encode متن به Base64
        const encodedText = Buffer.from(text).toString('base64');

        // ارسال پاسخ JSON با افزودن type و apikey برای نتیجه اول
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: "nothing-ben",
            result: [
                {
                    type: "base64",
                    apikey: apikey,
                    encoded_text: encodedText
                }
            ]
        }, null, 2));
    } catch (error) {
        // مدیریت خطا
        res.status(500).json({
            creator: "nothing-ben",
            status: 500,
            success: false,
            message: "An error occurred while encoding the text.",
            error: error.message
        });
    }
});
//DEFINE
app.get('/api/tools/define', async (req, res) => {
    const { text, apikey } = req.query; // دریافت متن و API Key از Query

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: "nothing-ben",
            message: "Invalid or missing API key."
        });
    }

    const keyData = checkUserLimit(apikey);

    // بررسی محدودیت استفاده
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: "nothing-ben",
            message: "Limit exceeded for this key."
        });
    }

    // بررسی وجود متن
    if (!text) {
        return res.status(400).json({
            creator: "nothing-ben",
            status: 400,
            success: false,
            message: "Text parameter is required."
        });
    }

    // افزایش مقدار استفاده از کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // دریافت تعریف متن از API
        const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${text}`);

        if (!response.data.list || response.data.list.length === 0) {
            return res.status(404).json({
                creator: "nothing-ben",
                status: 404,
                success: false,
                message: "No definitions found for the text."
            });
        }

        // پردازش داده‌ها
        const results = response.data.list.slice(0, 10).map((item, index) => ({
            ...(index === 0 ? { type: "word", apikey: apikey } : {}), // اضافه کردن type و apikey به اولین نتیجه
            definition: item.definition,
            permalink: item.permalink,
            thumbs_up: item.thumbs_up,
            author: item.author,
            word: item.word,
            defid: item.defid,
            current_vote: item.current_vote,
            written_on: item.written_on,
            example: item.example,
            thumbs_down: item.thumbs_down
        }));

        // ارسال پاسخ JSON
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: "nothing-ben",
            result: results
        }, null, 2));
    } catch (error) {
        // مدیریت خطا
        res.status(500).json({
            creator: "nothing-ben",
            status: 500,
            success: false,
            message: "An error occurred while fetching the definition.",
            error: error.message
        });
    }
});
//TINYURL CODE
app.get('/api/tools/tinyurl', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const url = req.query.url; // URL اصلی

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }

    // بررسی ارسال URL
    if (!url) {
        return res.status(400).json({
            status: false,
            message: 'No URL provided.'
        });
    }

    // افزایش مقدار مصرف کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // ارسال درخواست به TinyURL
        const tinyUrlResponse = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        const tinyUrl = tinyUrlResponse.data;

        // ساختار JSON خروجی
        const result = {
            type: "tinyurl",
            apikey: apikey,
            tiny_url: tinyUrl,
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: [result]
        }, null, 2)); // JSON مرتب با فاصله 4
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error creating TinyURL.',
            error: err.message
        });
    }
});
//WEATHER SEARCH
app.get('/api/search/weather', async (req, res) => {
  const { text: cityName, apikey } = req.query; // دریافت نام شهر و API Key

  // بررسی کلید API
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      code: 401,
      creator: "Nothing-Ben",
      message: "Invalid or missing API key."
    });
  }

  const keyData = checkUserLimit(apikey);

  // بررسی محدودیت استفاده از API Key
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      code: 403,
      creator: "Nothing-Ben",
      message: "API key usage limit exceeded."
    });
  }

  // بررسی وجود نام شهر
  if (!cityName) {
    return res.status(400).json({
      status: false,
      code: 400,
      creator: "Nothing-Ben",
      message: "City name (text parameter) is required."
    });
  }

  // افزایش مقدار استفاده از کلید
  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // دریافت داده‌های وضعیت آب‌وهوا از API OpenWeatherMap
    const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`;
    const { data } = await axios.get(weatherAPIUrl);

    // ساخت پاسخ
    const weatherData = {
      status: true,
      creator: "Nothing-Ben",
      result: [
      {
        type: "weather",
        apikey: apikey,
        city: data.name,
        country: data.sys.country,
        temperature: `${data.main.temp} °C`,
        description: data.weather[0].description,
        humidity: `${data.main.humidity}%`,
        windSpeed: `${data.wind.speed} m/s`,
        icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
      }
      ]
    };

    // ارسال پاسخ
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(weatherData, null, 2)); // ارسال JSON مرتب
  } catch (error) {
    console.error("Error fetching weather:", error.message);

    // مدیریت خطا
    res.status(500).json({
      status: false,
      creator: "Nothing-Ben",
      message: "There was an issue fetching the weather data. Please try again later."
    });
  }
});
//IS SHORTURL
app.get('/api/tools/is-shorturl', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const url = req.query.url; // URL اصلی

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }

    // بررسی ارسال URL
    if (!url) {
        return res.status(400).json({
            status: false,
            message: 'No URL provided.'
        });
    }

    // افزایش مقدار مصرف کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // ارسال درخواست به TinyURL
        const tinyUrlResponsee = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
        const issh = tinyUrlResponsee.data;

        // ساختار JSON خروجی
        const result = {
            type: "is",
            apikey: apikey,
            is_url: issh,
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: [result]
        }, null, 2)); // JSON مرتب با فاصله 4
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error creating TinyURL.',
            error: err.message
        });
    }
});
//RINGTONE SEARCH
const ringtoneSearch = async (searchText, apikey) => {
  try {
    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
      throw new Error('Invalid or missing API key.');
    }

    const keyData = checkUserLimit(apikey);
    if (keyData.used >= keyData.limit) {
      throw new Error('Limit exceeded for this key.');
    }

    // ارسال درخواست به سایت Meloboom برای جستجو
    const { data } = await axios.get("https://meloboom.com/en/search/" + searchText);
    const $ = cheerio.load(data);

    let results = [];

    // استخراج اطلاعات از صفحه جستجو
    $("#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li").each((index, element) => {
      let title = $(element).find('h4').text();
      let source = "https://meloboom.com/" + $(element).find('a').attr("href");
      let audio = $(element).find("audio").attr("src");

      let result = {
        title: title,
        source: source,
        audio: audio
      };

      // اگر این اولین نتیجه است، `type` و `apikey` را در ابتدای شیء اضافه می‌کنیم
      if (index === 0) {
        result = {
          type: "audio",
          apikey: apikey,
          ...result  // سایر ویژگی‌ها را به شیء اضافه می‌کنیم
        };
      }

      results.push(result);
    });

    // افزایش مقدار `used` و ذخیره‌سازی
    keyData.used += 1;
    saveApiKeys(apiKeys); // ذخیره وضعیت کلیدها

    return results;

  } catch (error) {
    throw error;
  }
};

app.get('/api/search/ringtone', async (req, res) => {
  const searchText = req.query.text || ''; // دریافت متن جستجو از پارامتر query
  const apikey = req.query.apikey; // دریافت کلید API
  try {
    // بررسی اینکه کلید API معتبر باشد
    if (!apikey || !apiKeys[apikey]) {
      return res.status(401).json({
        status: false,
        creator: 'Nothing-Ben',
        result: 'Invalid or missing API key.'
      });
    }

    const searchResults = await ringtoneSearch(searchText, apikey);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      creator: "Nothing-Ben",
      status: true,
      results: searchResults
    }, null, 2));
  } catch (error) {
    res.status(500).json({
      creator: "Nothing-Ben",
      status: false,
      error: error.message
    });
  }
});
//HAPPY MOD
const happymodSearch = async (searchText, apikey) => {
  try {
    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
      throw new Error('Invalid or missing API key.');
    }

    const keyData = checkUserLimit(apikey);
    if (keyData.used >= keyData.limit) {
      throw new Error('Limit exceeded for this key.');
    }

    // ارسال درخواست به سایت Happymod برای جستجو
    const { data } = await axios.get("https://www.happymod.com/search.html?q=" + searchText);
    const $ = cheerio.load(data);

    let titles = [];
    let links = [];
    let ratings = [];
    let images = [];
    let results = [];

    // استخراج اطلاعات از صفحه جستجو
    $("body > div.container-row.clearfix.container-wrap > div.container-left > section > div > div > h3 > a").each((_, element) => {
      let title = $(element).text();
      let link = "https://happymod.com" + $(element).attr("href");
      titles.push(title);
      links.push(link);
    });

    $("body > div.container-row.clearfix.container-wrap > div.container-left > section > div > div > div.clearfix > span").each((_, element) => {
      let rating = $(element).text();
      ratings.push(rating);
    });

    $("body > div.container-row.clearfix.container-wrap > div.container-left > section > div > a > img").each((_, element) => {
      let image = $(element).attr("data-original");
      images.push(image);
    });

    // ساخت نتایج نهایی
    for (let i = 0; i < links.length; i++) {
      let result = {
        title: titles[i],
        thumb: images[i],
        rating: ratings[i],
        link: links[i]
      };

      // اضافه کردن type و apikey فقط به نتیجه اول
      if (i === 0) {
        result = {
          type: "apk",
          apikey: apikey,
          ...result // اضافه کردن باقی فیلدها
        };
      }

      results.push(result);
    }

    // افزایش مقدار `used` و ذخیره‌سازی
    keyData.used += 1;
    saveApiKeys(apiKeys);

    return { creator: 'Nothing-Ben', data: results };

  } catch (error) {
    throw error;
  }
};

app.get('/api/search/happymod', async (req, res) => {
  const searchText = req.query.text || ''; // دریافت متن جستجو از پارامتر query
  const apikey = req.query.apikey; // دریافت کلید API

  try {
    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
      return res.status(401).json({
        creator: "Nothing-Ben",
        status: false,
        result: 'Invalid or missing API key.'
      });
    }

    const searchResults = await happymodSearch(searchText, apikey);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: true,
      creator: "Nothing-Ben",
      result: searchResults.data
    }, null, 2));
  } catch (error) {
    res.status(500).json({
      creator: "Nothing-Ben",
      status: false,
      error: error.message
    });
  }
});
//STICKER SEARCH
const stickersearch = async (searchText, apikey) => {
  try {
    // جستجوی استیکر بر اساس متن ورودی
    const { data } = await axios.get("https://getstickerpack.com/stickers?query=" + searchText);
    const $ = cheerio.load(data);
    let stickerLinks = [];

    // دریافت لینک‌های بسته‌های استیکر
    $("#stickerPacks > div > div:nth-child(3) > div > a").each((_, element) => {
      stickerLinks.push($(element).attr("href"));
    });

    // انتخاب یک بسته استیکر به صورت تصادفی
    let randomStickerPack = stickerLinks[Math.floor(Math.random() * stickerLinks.length)];
    
    // دریافت اطلاعات استیکرها از لینک تصادفی
    const { data: stickerData } = await axios.get(randomStickerPack);
    const $$ = cheerio.load(stickerData);
    let stickerImages = [];

    // استخراج تصاویر استیکرها
    $$("#stickerPack > div > div.row > div > img").each((_, imgElement) => {
      stickerImages.push($$(imgElement).attr("src").split("&d=")[0]);
    });

    const result = {
      title: $$("#intro > div > div > h1").text(),
      author: $$("#intro > div > div > h5 > a").text(),
      author_link: $$("#intro > div > div > h5 > a").attr("href"),
      sticker: stickerImages
    };

    // افزودن type و apikey به نتیجه
    return {
      type: "sticker",
      apikey: apikey,
      ...result
    };

  } catch (error) {
    throw error;
  }
};

app.get('/api/search/sticker', async (req, res) => {
  const searchText = req.query.text || '';  // دریافت متن جستجو از پارامتر query
  const apikey = req.query.apikey; // دریافت کلید API
  try {
    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
      return res.status(401).json({
        status: false,
        creator: "Nothing-Ben",
        result: 'Invalid or missing API key.'
      });
    }

    const stickerResult = await stickersearch(searchText, apikey);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: true,
      creator: "Nothing-Ben",
      result: stickerResult
    }, null, 2));
  } catch (error) {
    res.status(500).json({
      creator: "Nothing-Ben",
      status: false,
      error: error.message
    });
  }
});
//WIKIMEDIA
const wikimediaSearch = async (searchText, apikey, retries = 3) => {
  try {
    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
      throw new Error('Invalid or missing API key.');
    }

    const keyData = checkUserLimit(apikey);
    if (keyData.used >= keyData.limit) {
      throw new Error('Limit exceeded for this key.');
    }

    const { data } = await axios.get(`https://commons.wikimedia.org/w/index.php?search=${searchText}&title=Special:MediaSearch&go=Go&type=image`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      }
    });

    const $ = cheerio.load(data);
    let results = [];

    $(".sdms-search-results__list-wrapper > div > a").each((index, element) => {
      let title = $(element).find("img").attr("alt");
      let source = $(element).attr("href");
      let image = $(element).find("img").attr("data-src") || $(element).find("img").attr("src");

      let result = {
        title: title,
        source: source,
        image: image
      };

      // اگر این اولین نتیجه است، `type` و `apikey` را در ابتدای شیء اضافه می‌کنیم
      if (index === 0) {
        result = {
          type: "image",
          apikey: apikey,
          ...result  // سایر ویژگی‌ها را به شیء اضافه می‌کنیم
        };
      }

      results.push(result);
    });

    // افزایش مقدار `used` و ذخیره‌سازی
    keyData.used += 1;
    saveApiKeys(apiKeys); // ذخیره وضعیت کلیدها

    return results;

  } catch (error) {
    if (retries > 0 && error.code === 'ECONNRESET') {
      console.log(`Connection reset, retrying... (${retries} retries left)`);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(wikimediaSearch(searchText, apikey, retries - 1));
        }, 5000);
      });
    } else {
      console.error("Request failed:", error.message);
      throw error;
    }
  }
};

app.get('/api/search/wikimedia', async (req, res) => {
  const searchText = req.query.text || ''; 
  const apikey = req.query.apikey; // دریافت کلید API
  try {
    // بررسی اینکه کلید API معتبر باشد
    if (!apikey || !apiKeys[apikey]) {
      return res.status(401).json({
        status: false,
        creator: 'Nothing-Ben',
        result: 'Invalid or missing API key.'
      });
    }

    const searchResults = await wikimediaSearch(searchText, apikey);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: true,
      creator: "Nothing-Ben",
      results: searchResults
    }, null, 2));
  } catch (error) {
    res.status(500).json({
      creator: "Nothing-Ben",
      status: false,
      error: error.message
    });
  }
});
//SHORT URL OFFCIAL
app.get('/api/create-shorturl', (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const originalUrl = req.query.url; // دریافت لینک اصلی

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }

    // بررسی اینکه لینک ارسال شده یا نه
    if (!originalUrl) {
        return res.status(400).json({
            status: false,
            message: 'No URL provided.'
        });
    }

    // افزایش مقدار مصرف کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    // خواندن لینک‌های ذخیره‌شده
    let links = {};
    const linksFile = 'shortlinks.json';
    if (fs.existsSync(linksFile)) {
        links = JSON.parse(fs.readFileSync(linksFile));
    }

    // تولید کد کوتاه و اضافه کردن .com
    const shortCode = Math.random().toString(36).substr(2, 6) + '.com';

    // ذخیره لینک
    links[shortCode] = originalUrl;
    fs.writeFileSync(linksFile, JSON.stringify(links, null, 2));

    // ساختار JSON خروجی مشابه TinyURL با استفاده از JSON.stringify
    const result = {
        status: true,
        creator: 'nothing-ben',
        apikey: apikey,
        original_url: originalUrl,
        short_url: `https://${req.hostname}/${shortCode}`
    };

    // استفاده از JSON.stringify برای ایجاد خروجی به صورت مرتب
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        status: true,
        creator: 'nothing-ben',
        result: [result]
    }, null, 2));  // 4 فاصله برای مرتب‌سازی و خوانایی بهتر
});
app.get('/:shortCode', (req, res) => {
    const shortCode = req.params.shortCode;

    // خواندن لینک‌ها از فایل
    const linksFile = 'shortlinks.json';
    if (!fs.existsSync(linksFile)) {
        return res.status(404).json({
            status: false,
            message: 'URL not found.'
        });
    }

    const links = JSON.parse(fs.readFileSync(linksFile));
    const originalUrl = links[shortCode];

    if (originalUrl) {
        res.redirect(originalUrl); // ریدایرکت به لینک اصلی
    } else {
        res.status(404).json({
            status: false,
            message: 'URL not found.'
        });
    }
});
//SHORT URL
app.get('/api/tools/shorturl', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const url = req.query.url; // URL اصلی

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey); // بررسی محدودیت کاربر

    // بررسی محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            message: 'API key usage limit exceeded.'
        });
    }

    // بررسی ارسال URL
    if (!url) {
        return res.status(400).json({
            status: false,
            message: 'No URL provided.'
        });
    }

    // افزایش مقدار مصرف کلید
    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        // ارسال درخواست به ShortURL
        const response = await axios.post('https://www.shorturl.at/shortener.php', null, {
            params: { url: url }
        });
        const shortUrl = response.data || 'Shortening failed';

        // ساختار JSON خروجی
        const result = {
            type: "shorturl",
            apikey: apikey,
            short_url: shortUrl,
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: [result]
        }, null, 2)); // JSON مرتب با فاصله 4
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error creating ShortURL.',
            error: err.message
        });
    }
});
//INGDL
app.get('/api/downloader/Instagram', async (req, res) => {
    const url = req.query.url; // دریافت URL از query string
    const apikey = req.query.apikey; // دریافت API key

    if (!url || !apikey) {
        return res.status(400).json({
            status: false,
            message: 'URL and API key are required.'
        });
    }

    // بررسی اینکه URL اینستاگرام باشد
    if (!url.includes('instagram.com')) {
        return res.status(400).json({
            status: false,
            message: 'Invalid Instagram URL.'
        });
    }

    try {
        // دانلود پست اینستاگرام
        const data = await igdl(url);
        
        // گرفتن لینک‌های thumbnail و url
        const thumbnailLink = data[0].thumbnail;
        const videoUrl = data[0].url;

        if (!thumbnailLink || !videoUrl) {
            return res.status(500).json({
                status: false,
                message: 'Error retrieving Instagram post details.'
            });
        }

        // کوتاه کردن لینک‌ها با TinyURL
        const shortThumbnailLink = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(thumbnailLink)}`);
        const shortVideoUrl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(videoUrl)}`);

        // ساختار JSON و استفاده از JSON.stringify برای ارسال خروجی
        const responseData = {
            status: true,
            creator: "Nothing-Ben", // نام سازنده
            result: [{
                type: "video", // نوع محتوا
                apikey: apikey, // کلید API
                url: url, // URL اصلی
                thumbnail: shortThumbnailLink.data, // لینک کوتاه‌شده تصویر بندانگشتی
                downloa_url: shortVideoUrl.data // لینک کوتاه‌شده ویدیو
            }]
        };

        // ارسال پاسخ با استفاده از JSON.stringify و مرتب‌سازی آن
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(responseData, null, 2)); // مرتب کردن JSON با فاصله 4

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error processing request.',
            error: err.message
        });
    }
});
//APK DOWNLOAD LINK
app.get('/api/downloader/apkdl', async (req, res) => {
  const { text, apikey } = req.query; // دریافت پارامتر جستجو و API Key

  // بررسی کلید API
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  // بررسی محدودیت استفاده
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'Limit exceeded for this key.'
    });
  }

  // بررسی وجود متن
  if (!text) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'text parameter is required.'
    });
  }

  // افزایش مقدار استفاده از کلید
  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // مرحله اول: جستجوی اپلیکیشن
    const searchResponse = await axios.get(`https://bk9.fun/search/apk?q=${encodeURIComponent(text)}`);
    if (!searchResponse.data.BK9 || searchResponse.data.BK9.length === 0) {
      return res.status(404).json({
        status: false,
        creator: 'Nothing-Ben',
        message: 'No results found.'
      });
    }

    // انتخاب اولین نتیجه از جستجو
    const firstResult = searchResponse.data.BK9[0];
    const appId = firstResult.id;

    // مرحله دوم: دریافت لینک دانلود
    const downloadResponse = await axios.get(`https://bk9.fun/download/apk?id=${appId}`);
    if (!downloadResponse.data.BK9) {
      return res.status(404).json({
        status: false,
        creator: 'Nothing-Ben',
        message: 'Download link not found.'
      });
    }

    const appData = downloadResponse.data.BK9;

    // ساخت پاسخ JSON
    const responseData = {
      status: true,
      creator: 'Nothing-Ben',
      result: [
      {
        type: 'apk',
        apikey: apikey, // اضافه کردن API Key به پاسخ
        name: appData.name,
        lastup: appData.lastup,
        package: appData.package,
        thumbnail: appData.icon,
        download_url: appData.dllink
      }
      ]
    };

    // تنظیم هدر و ارسال JSON
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(responseData, null, 2)); // ارسال پاسخ به شکل مرتب
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'Internal server error.'
    });
  }
});
//APK SEARCH
app.get('/api/search/apk-search', async (req, res) => {
  const { text, apikey } = req.query; // دریافت پارامتر جستجو و API Key

  // بررسی کلید API
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  // بررسی محدودیت استفاده
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'Limit exceeded for this key.'
    });
  }

  // بررسی وجود متن
  if (!text) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'text parameter is required.'
    });
  }

  // افزایش مقدار استفاده از کلید
  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // مرحله اول: جستجوی اپلیکیشن
    const searchResponse = await axios.get(`https://bk9.fun/search/apk?q=${encodeURIComponent(text)}`);
    if (!searchResponse.data.BK9 || searchResponse.data.BK9.length === 0) {
      return res.status(404).json({
        status: false,
        creator: 'Nothing-Ben',
        message: 'No results found.'
      });
    }

    // انتخاب اولین نتیجه از جستجو
    const firstResult = searchResponse.data.BK9[0];
    const appId = firstResult.id;

    // مرحله دوم: دریافت لینک دانلود
    const downloadResponse = await axios.get(`https://bk9.fun/download/apk?id=${appId}`);
    if (!downloadResponse.data.BK9) {
      return res.status(404).json({
        status: false,
        creator: 'Nothing-Ben',
        message: 'Download link not found.'
      });
    }

    const appData = downloadResponse.data.BK9;

    // ساخت پاسخ JSON
    const responseData = {
      status: true,
      creator: 'Nothing-Ben',
      result: [
      {
        type: 'apk',
        apikey: apikey, // اضافه کردن API Key به پاسخ
        name: appData.name,
        lastup: appData.lastup,
        package: appData.package,
        thumbnail: appData.icon
        }
      ]
    };

    // تنظیم هدر و ارسال JSON
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(responseData, null, 2)); // ارسال پاسخ به شکل مرتب
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      message: 'Internal server error.'
    });
  }
});
//TIKTOK DL
app.get('/api/downloader/tiktok', async (req, res) => {
    const url = req.query.url; // دریافت URL از query string
    const apikey = req.query.apikey; // دریافت API key

    if (!url || !apikey) {
        return res.status(400).json({
            status: false,
            message: 'URL and API key are required.'
        });
    }

    // بررسی اینکه URL شامل tiktok باشد
    const validTikTokDomains = ['tiktok.com', 'vt.tiktok.com', 'www.tiktok.com'];
    const isValidUrl = validTikTokDomains.some(domain => url.includes(domain));

    if (!isValidUrl) {
        return res.status(400).json({
            status: false,
            message: 'Invalid TikTok URL.'
        });
    }

    try {
        // دریافت اطلاعات ویدیو از TikTok
        const data = await ttdl(url);

        // گرفتن لینک‌های thumbnail و url
        const thumbnailLink = data.thumbnail;
        const videoUrl = data.video[0];
        const title = data.title;

        if (!thumbnailLink || !videoUrl) {
            return res.status(500).json({
                status: false,
                message: 'Error retrieving TikTok post details.'
            });
        }

        // کوتاه کردن لینک‌ها با TinyURL
        const shortThumbnailLink = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(thumbnailLink)}`);
        const shortVideoUrl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(videoUrl)}`);

        // ساختار JSON و استفاده از JSON.stringify برای ارسال خروجی
        const responseData = {
            status: true,
            creator: "Nothing-Ben", // نام سازنده
            result: [{
                type: "video", // نوع محتوا
                apikey: apikey, // کلید API
                title: title,
                url: url, // URL اصلی
                thumbnail: shortThumbnailLink.data, // لینک کوتاه‌شده تصویر بندانگشتی
                video_url: shortVideoUrl.data // لینک کوتاه‌شده ویدیو
            }]
        };

        // ارسال پاسخ با استفاده از JSON.stringify و مرتب‌سازی آن
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(responseData, null, 2)); // مرتب کردن JSON با فاصله 4

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error processing request.',
            error: err.message
        });
    }
});
//YTMP4 DL
app.get('/api/downloader/ytmp4', async (req, res) => {
    const url = req.query.url; // دریافت URL از query string
    const apikey = req.query.apikey; // دریافت API key

    if (!url || !apikey) {
        return res.status(400).json({
            status: false,
            message: 'URL and API key are required.'
        });
    }

    try {
        // دریافت اطلاعات ویدیو از YouTube
        const data = await youtube(url);

        if (!data || !data.mp4) {
            return res.status(500).json({
                status: false,
                message: 'Error retrieving YouTube video details.'
            });
        }

        const mp4TinyUrl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(data.mp4)}`);

        // ساختار JSON برای پاسخ
        const responseData = {
            status: true,
            creator: "Nothing-Ben", // نام سازنده
            result: [{
                type: "video",
                apikey: apikey,
                quality: "480p",
                title: data.title, // عنوان ویدیو
                url: data.url, // URL اصلی
                views: data.views, // تعداد بازدید
                duration: data.duration, // مدت زمان ویدیو
                thumbnail: data.thumbnail, // تصویر بندانگشتی
                downloa_url: mp4TinyUrl.data // لینک کوتاه شده فایل ویدیویی
            }]
        };

        // ارسال پاسخ JSON
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(responseData, null, 2)); // مرتب کردن JSON با فاصله 4

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error processing request.',
            error: err.message
        });
    }
});
//YTMP3 YOUTUBE
app.get('/api/downloader/ytmp3', async (req, res) => {
    const url = req.query.url; // دریافت URL از query string
    const apikey = req.query.apikey; // دریافت API key

    if (!url || !apikey) {
        return res.status(400).json({
            status: false,
            message: 'URL and API key are required.'
        });
    }

    try {
        // دریافت اطلاعات ویدیو از YouTube
        const data = await youtube(url);

        if (!data || !data.mp4) {
            return res.status(500).json({
                status: false,
                message: 'Error retrieving YouTube video details.'
            });
        }

        // کوتاه کردن لینک‌های mp3 و mp4
        const mp3TinyUrl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(data.mp3)}`);
        
        const responseData = {
            status: true,
            creator: "Nothing-Ben", // نام سازنده
            result: [{
                type: "audio", // نوع محتوا
                apikey: apikey, // کلید API
                quality: "128kbps",
                title: data.title, // عنوان ویدیو
                url: data.url, // URL اصلی
                views: data.views, // تعداد بازدید
                duration: data.duration, // مدت زمان ویدیو
                thumbnail: data.thumbnail, // تصویر بندانگشتی
                downloa_url: mp3TinyUrl.data // لینک کوتاه شده فایل ویدیویی
            }]
        };

        // ارسال پاسخ JSON
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(responseData, null, 2)); // مرتب کردن JSON با فاصله 4

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error processing request.',
            error: err.message
        });
    }
});
//PLAY COMMAND API
app.get('/api/downloader/play-audio', async (req, res) => {
    const text = req.query.text; // متن جستجو
    const apikey = req.query.apikey; // کلید API

    if (!text || !apikey) {
        return res.status(400).json({
            status: false,
            message: 'Text and API key are required.'
        });
    }

    try {
        // جستجو با استفاده از کتابخانه yt-search
        const searchResults = await ytSearch(text);
        const firstResult = searchResults.videos[0]; // انتخاب اولین ویدیو

        if (!firstResult) {
            return res.status(404).json({
                status: false,
                message: 'No results found for the search query.'
            });
        }

        const videoUrl = firstResult.url; // URL اولین ویدیو

        // به جای درخواست به API خارجی، از تابع داخلی استفاده کنید
        const quality = "128"; // کیفیت دلخواه
        const result = await ytmp3(videoUrl, quality); // فراخوانی تابع داخلی

        if (!result.status) {
            return res.status(500).json({
                status: false,
                message: 'Error retrieving download link.'
            });
        }

        // ارسال پاسخ به کاربر
        const responseData = {
            status: true,
            creator: "Nothing-Ben",
            result: {
                type: "audio",
                quality: "128kbps",
                title: result.metadata.title,
                url: videoUrl, // URL ویدیو
                thumbnail: result.metadata.thumbnail, // تصویر بندانگشتی
                download_url: result.download.url // لینک دانلود
            }
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(responseData, null, 2)); // JSON با فرمت زیبا

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error processing request.',
            error: err.message
        });
    }
});
// PLAY VIDEO
app.get('/api/downloader/play-video', async (req, res) => {
  const text = req.query.text;  // متن جستجو
  const apikey = req.query.apikey;  // کلید API

  if (!text || !apikey) {
    return res.status(400).json({
      status: false,
      message: 'Text and API key are required.'
    });
  }

  try {
    // جستجو با استفاده از کتابخانه yt-search
    const searchResults = await ytSearch(text);
    const firstResult = searchResults.videos[0];  // انتخاب اولین ویدیو

    if (!firstResult) {
      return res.status(404).json({
        status: false,
        message: 'No results found for the search query.'
      });
    }

    const videoUrl = firstResult.url;  // URL اولین ویدیو

    // به جای درخواست به API خارجی، از تابع داخلی استفاده کنید
    const quality = "720";  // کیفیت دلخواه
    const result = await ytmp4(videoUrl, quality);  // فراخوانی تابع داخلی برای دریافت لینک ویدیو

    if (!result.status) {
      return res.status(500).json({
        status: false,
        message: 'Error retrieving download link.'
      });
    }

    // ارسال پاسخ به کاربر
    const responseData = {
      status: true,
      creator: "Nothing-Ben",
      result: {
        type: "video",
        quality: "720p",
        title: result.metadata.title,
        url: videoUrl,  // URL ویدیو
        thumbnail: result.metadata.thumbnail,  // تصویر بندانگشتی
        download_url: result.download.url  // لینک دانلود
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(responseData, null, 2));  // JSON با فرمت زیبا

  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Error processing request.',
      error: err.message
    });
  }
});
//XNXX SEARCH
app.get('/api/search/xnxx-search', async (req, res) => {
  const apikey = req.query.apikey;
  const searchText = req.query.text;

  // بررسی وجود کلید API و مقدار متنی
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      result: 'Invalid or missing API key.'
    });
  }

  if (!searchText) {
    return res.status(400).json({
      status: false,
      result: 'No search text provided.'
    });
  }

  try {
    // تابع جستجو در xnxx
    const result = await xnxxSearch(searchText);

    // ارسال نتیجه به صورت JSON با فرمت مورد نظر
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: result.status,
      creator: result.creator,
      result: result.result.map((item, index) => {
        if (index === 0) {
          return {
            type: 'video',
            apikey: apikey,
            title: item.title,
            link: item.link
          };
        } else {
          return {
            title: item.title,
            link: item.link
          };
        }
      }),
    }, null, 2));  // استفاده از 4 فاصله برای فرمت JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      result: 'Error fetching data.',
      error: error.message
    });
  }
});

// تابع جستجو در xnxx
async function xnxxSearch(query) {
  const response = await fetch(`https://www.xnxx.com/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {
    'method': 'get'
  });

  const body = await response.text();
  const $ = cheerio.load(body);
  let result = [];

  $("div.mozaique").each((index, element) => {
    const links = $(element).find("div.thumb a").map((_, el) => "https://www.xnxx.com" + $(el).attr('href').replace("/THUMBNUM/", '/')).get();
    const titles = $(element).find("div.thumb-under a").map((_, el) => $(el).attr("title")).get();
    
    for (let i = 0; i < links.length; i++) {
      result.push({
        title: titles[i],
        link: links[i]
      });
    }
  });

  return {
    status: true,
    creator: 'Nothing-Ben',
    result: result
  };
}
//XNXX DOWNLOAD
app.get('/api/downloader/xnxx-dl', async (req, res) => {
  const apikey = req.query.apikey;
  const videoUrl = req.query.url;

  // بررسی کلید API و آدرس ویدئو
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      result: 'Invalid or missing API key.'
    });
  }

  if (!videoUrl) {
    return res.status(400).json({
      status: false,
      result: 'No video URL provided.'
    });
  }

  try {
    // اجرای تابع xnxxdl برای استخراج داده‌ها
    const result = await xnxxdl(videoUrl);

    // ارسال خروجی در فرمت JSON
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: true,
      creator: 'Nothing-Ben',
      result: {
        type: 'video',
        title: result.title,
        duration: result.duration,
        quality: result.quality,
        thumb: result.thumb,
        size: result.size,
        download_link: result.url_dl
      }
    }, null, 2)); // فرمت JSON با فاصله 4
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      result: 'Error processing download request.',
      error: error.message
    });
  }
});

// تابع xnxxdl برای استخراج اطلاعات ویدئو
async function xnxxdl(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $("meta[property=\"og:title\"]").attr('content');
    const duration = $("span.metadata").text().replace(/\n/gi, '').split("\t\t\t\t\t")[1]?.split(/-/)[0]?.trim();
    const quality = $("span.metadata").text().trim().split("- ")[1]?.replace(/\t\t\t\t\t/, '');
    const thumb = $("meta[property=\"og:image\"]").attr("content");
    const scriptContent = $("#video-player-bg > script:nth-child(6)").html();
    const url_dl = (scriptContent.match(/html5player\.setVideoUrlHigh'([^']+)'/) || [])[1];
    const size = await getFileSize(url_dl);

    const sizeB = parseFloat(size) * (/GB/i.test(size) ? 1048576 : /MB/i.test(size) ? 1024 : /KB/i.test(size) ? 1 : /bytes?/i.test(size) ? 0.001 : /B/i.test(size) ? 0.1 : 0);

    return {
      title,
      duration,
      quality,
      thumb,
      size,
      sizeB,
      url_dl
    };
  } catch (error) {
    throw error;
  }
}

// تابع برای دریافت حجم فایل
async function getFileSize(url) {
  try {
    const response = await axios.head(url);
    const sizeInBytes = response.headers['content-length'];
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    return `${sizeInMB} MB`;
  } catch (error) {
    return 'Unknown size';
  }
}
//MOVIES STALK
app.get("/api/movie/movie", async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const text = req.query.text;

    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey);

    // بررسی استفاده از محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Limit exceeded for this key.'
        });
    }
    
    if (!text) {
        return res.status(400).json({
            status: false,
            message: "Text parameter is required",
        });
    }

    keyData.used += 1;
    saveApiKeys(apiKeys); // ذخیره وضعیت کلیدها
    
    try {
        // درخواست به YTS API برای جستجوی فیلم
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(text)}`);
        const data = response.data;

        if (!data.data.movies || data.data.movies.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Movie not found",
            });
        }

        const movie = data.data.movies[0];

        // پاسخ فیلم
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: "Nothing-Ben",
            result: [
            {
                type: "movie",
                apikey: apikey,
                title: movie.title,
                year: movie.year,
                imdbRating: `${movie.rating} (${movie.num_votes} votes)`,
                released: movie.date_uploaded,
                runtime: movie.runtime + " minutes",
                genres: movie.genres.join(", "),
                summary: movie.summary,
                poster: movie.large_cover_image, // تصویر اصلی (Poster)
                thumbnail: movie.medium_cover_image, // تصویر کوچک (Thumbnail)
                imdbUrl: `https://www.imdb.com/title/${movie.imdb_code}`,
            },
            ]
            }, null, 2)); // دو فاصله برای شفافیت
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching movie data",
        });
    }
});
//INSTAGRAM STALK
app.get('/api/stalk/Instagram-stalk', async (req, res) => {
  const username = req.query.user;  // گرفتن نام کاربری از URL
  
  if (!username) {
    return res.status(400).json({
      status: false,
      message: 'Please provide a username in the query parameters.'
    });
  }

  try {
    const data = await igStalk(username);  // فراخوانی پکیج 'api-stalkerr'
    if (data.status) {
      // ساخت پاسخ جدید با فرمت دلخواه شما
      const result = {
        status: true,
        creator: 'Nothing-ben',
        result: {
          type: 'Instagram-stalk',
          name: data.name,
          username: data.username,
          description: data.description,
          posts: data.posts,
          followers: data.followers,
          following: data.following,
          profilePic: data.profilePic
        }
      };
      res.json(result);  // ارسال پاسخ با فرمت جدید
    } else {
      res.status(500).json({
        status: false,
        message: 'Error fetching Instagram data.',
        error: data.message
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
});
//TIKTOK STALK
const tiktokstalk = async (user) => {
  try {
    const url = await fetch(`https://tiktok.com/@${user}`, {
      headers: {
        'User-Agent': 'PostmanRuntime/7.32.2'
      }
    });
    const html = await url.text();
    const $ = cheerio.load(html);
    const data = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').text();
    const result = JSON.parse(data);
    
    // بررسی وضعیت کاربر
    if (result['__DEFAULT_SCOPE__']['webapp.user-detail'].statusCode !== 0) {
      return {
        status: 'error',
        message: 'User not found!',
      };
    }

    const res = result['__DEFAULT_SCOPE__']['webapp.user-detail']['userInfo'];
    return res;
  } catch (err) {
    console.log(err);
    return { status: 'error', message: err.message };
  }
};

// API endpoint برای استعلام TikTok
app.get('/api/stalk/tiktok-stalk', async (req, res) => {
  const apikey = req.query.apikey; // دریافت کلید API
  const user = req.query.user;

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  // بررسی استفاده از محدودیت
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  if (!user) {
    return res.status(400).json({
      status: false,
      message: "User parameter is required",
    });
  }

  keyData.used += 1;
  saveApiKeys(apiKeys); // ذخیره وضعیت کلیدها
    
  try {
    const result = await tiktokstalk(user);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: true,
      creator: "Nothing-Ben",
      result
    }, null, 2)); // دو فاصله برای شفافیت
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred",
      error: error.message
    });
  }
});
/// SEARCH YOUTUBE API with API key
app.get('/api/search/yt-search', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const query = req.query.text; // دریافت متن جستجو

    // بررسی کلید API و محدودیت‌های آن
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey);

    // بررسی استفاده از محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Limit exceeded for this key.'
        });
    }

    // بررسی عدم ارسال query
    if (!query) {
        return res.status(400).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'No search query provided.'
        });
    }

    // افزایش مقدار `used` و ذخیره‌سازی
    keyData.used += 1;
    saveApiKeys(apiKeys); // ذخیره وضعیت کلیدها

    try {
        // جستجوی ویدیوها در یوتیوب
        const results = await ytSearch(query);
        const videos = results.videos
            .sort((a, b) => b.views - a.views) // مرتب‌سازی بر اساس تعداد بازدید
            .slice(0, 9) // انتخاب 3 نتیجه اول
            .map(video => ({
                type: "video",
                apikey: apikey, // کلید API
                videoId: video.videoId,
                url: video.url,
                title: video.title,
                description: video.description || "", // توضیحات ویدیو
                image: video.thumbnail, // لینک تصویر بندانگشتی
                thumbnail: video.thumbnail, // لینک تصویر بندانگشتی
                seconds: video.duration.seconds || 0, // مدت زمان بر حسب ثانیه
                timestamp: video.duration.timestamp || "0:00", // مدت زمان در قالب hh:mm:ss
                duration: video.duration, // شیء مدت زمان
                ago: video.ago, // تاریخ انتشار (مثلاً "1 year ago")
                views: video.views, // تعداد بازدید
                author: {
                    name: video.author.name, // نام کانال
                    url: video.author.url // لینک کانال
                }
            }));

        // ارسال JSON مرتب‌شده
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: videos
        }, null, 2)); // JSON با فاصله 4
    } catch (err) {
        res.status(500).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Error fetching YouTube search API',
            error: err.message
        });
    }
});
//STALK WACHANNALE
app.get('/api/stalk/wachannel-stalk', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const { url } = req.query; // دریافت URL کانال

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey);

    // بررسی محدودیت استفاده
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Limit exceeded for this key.'
        });
    }

    // بررسی عدم ارسال URL
    if (!url) {
        return res.status(400).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'No URL provided.'
        });
    }

    // افزایش مقدار استفاده
    keyData.used += 1;
    saveApiKeys(apiKeys); // ذخیره وضعیت کلیدها

    try {
        // ارسال درخواست و بارگذاری داده‌ها با cheerio
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // استخراج داده‌ها
        const name = $('meta[property="og:title"]').attr('content') || 'Unknown';
        const img = $('meta[property="og:image"]').attr('content') || 'No Image';
        let description = $('meta[property="og:description"]').attr('content') || 'No Description';
        
        // استخراج فالوورها از توضیحات (فقط برای فالوورها)
        let followersMatch = description.match(/(\d+)\s*followers/);
        let followers = followersMatch ? followersMatch[1] : 'Not provided';

        // توضیحات کانال بدون فالوورها
        description = description.replace(/\d+\s*followers/, '').trim();

        // ارسال داده‌ها به صورت JSON با ساختار مشخص شده
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: [
                {
                    type: "whatsapp",
                    apikey: apikey,
                    name, // نام کانال
                    image: img, // تصویر کانال
                    description, // توضیحات کانال بدون فالوورها
                    followers, // تعداد دنبال‌کنندگان
                    link: url // لینک کانال
                }
            ]
        }, null, 2));
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Error scraping channel data',
            error: err.message
        });
    }
});
//STALK GITHUB
app.get('/api/stalk/github-stalk', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const username = req.query.user; // دریافت نام کاربری گیت‌هاب

    // بررسی کلید API و محدودیت‌های آن
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey);

    // بررسی استفاده از محدودیت
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Limit exceeded for this key.'
        });
    }

    // بررسی عدم ارسال نام کاربری
    if (!username) {
        return res.status(400).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'No username provided.'
        });
    }

    // افزایش مقدار `used` و ذخیره‌سازی
    keyData.used += 1;
    saveApiKeys(apiKeys); // ذخیره وضعیت کلیدها

    try {
        // درخواست به API گیت‌هاب
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const userData = response.data;

        // ارسال JSON مرتب‌شده مشابه با ساختار YouTube API
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: [{
                type: "github",
                apikey: apikey,
                username: userData.login,
                nickname: userData.name || 'Not provided',
                bio: userData.bio || 'Not available',
                id: userData.id,
                profile_pic: userData.avatar_url,
                url: userData.html_url,
                type: userData.type,
                location: userData.location || 'Not provided',
                public_repositories: userData.public_repos,
                followers: userData.followers,
                following: userData.following,
                created_at: userData.created_at,
                updated_at: userData.updated_at
            }]
        }, null, 2)); // JSON با فاصله 4
    } catch (err) {
        res.status(500).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Error fetching GitHub user data',
            error: err.message
        });
    }
});
//TIKTOK STALK
app.get('/api/stalk/tiktok-stalk', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const username = req.query.user; // دریافت نام کاربری TikTok

    // بررسی کلید API
    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey);

    // بررسی محدودیت استفاده
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Limit exceeded for this key.'
        });
    }

    // بررسی عدم ارسال نام کاربری
    if (!username) {
        return res.status(400).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'No username provided.'
        });
    }

    // افزایش مقدار استفاده
    keyData.used += 1;
    saveApiKeys(apiKeys); // ذخیره وضعیت کلیدها

    try {
        // ارسال درخواست به صفحه TikTok
        const response = await axios.get(`https://www.tiktok.com/@${username}`);
        const $ = cheerio.load(response.data);

        // استخراج داده‌ها از صفحه
        const name = $('h1[data-e2e="user-profile-name"]').text() || 'Unknown';
        const profileImage = $('img[data-e2e="user-avatar"]').attr('src') || 'No Image';
        const description = $('h2[data-e2e="user-bio"]').text() || 'No Description';
        const followers = $('strong[data-e2e="followers-count"]').text() || 'Not provided';
        const following = $('strong[data-e2e="following-count"]').text() || 'Not provided';
        const bio = $('h2[data-e2e="user-bio"]').text() || 'Not available';
        const likes = $('strong[data-e2e="likes-count"]').text() || 'Not available';

        // ارسال داده‌ها به صورت JSON
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: true,
            creator: 'Nothing-Ben',
            result: [{
                type: "tiktok",
                apikey: apikey,
                profile: profileImage,
                name,
                username: `@${username}`,
                followers,
                following,
                description,
                bio,
                likes,
                link: `https://www.tiktok.com/@${username}`
            }]
        }, null, 2));
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: false,
            creator: 'Nothing-Ben',
            result: 'Error scraping TikTok data',
            error: err.message
        });
    }
});
//NPM SEARCH
async function npmSearch(packageName) {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    const { name, description } = response.data;
    const latestVersion = response.data['dist-tags'].latest;
    const packageLink = `https://www.npmjs.com/package/${name}`;
    const downloadLink = `https://registry.npmjs.org/${name}/-/${name}-${latestVersion}.tgz`;
    
    const packagePage = await axios.get(packageLink);
    const $ = cheerio.load(packagePage.data);
    const publishedDate = $("time").first().text();
    const owner = response.data.maintainers[0].name;
    const keywords = response.data.keywords;
    const homepage = response.data.homepage;
    const license = response.data.license;
    const dependencies = response.data.dependencies;
    const readme = $("div[class='markdown']").html();

    return {
      name,
      description,
      version: latestVersion,
      packageLink,
      downloadLink,
      publishedDate,
      owner,
      keywords,
      homepage,
      license,
      dependencies,
      readme
    };
  } catch (error) {
    throw "Error while fetching package information.";
  }
}

// API route for searching npm package
app.get('/api/search/npm-search', async (req, res) => {
  const apikey = req.query.apikey; // دریافت کلید API
  const query = req.query.text; // دریافت متن جستجو

  // بررسی کلید API و محدودیت‌های آن
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  // بررسی استفاده از محدودیت
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  // بررسی عدم ارسال query
  if (!query) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No search query provided.'
    });
  }

  // افزایش مقدار `used` و ذخیره‌سازی
  keyData.used += 1;

  try {
    const result = await npmSearch(query);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: true,
      creator: 'Nothing-Ben',
      result: {
        type: "npm-package",
        apikey: apikey,
        name: result.name,
        description: result.description,
        version: result.version,
        packageLink: result.packageLink,
        downloadLink: result.downloadLink,
        publishedDate: result.publishedDate,
        owner: result.owner,
        keywords: result.keywords,
        homepage: result.homepage,
        license: result.license,
        dependencies: result.dependencies,
        readme: result.readme
      }
    }, null, 2)); // JSON با فاصله 4
  } catch (error) {
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching npm package data',
      error: error
    });
  }
});
//COMPLETE ✅
//PORN HUB SEARCH
async function phSearch(query) {
  try {
    const response = await fetch("https://www.pornhub.com/video/search?search=" + query);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const results = [];

    $("li[data-video-segment]").each((index, element) => {
      if (index < 15) {
        const videoLink = $(element).find(".title a").attr("href").trim();
        const videoTitle = $(element).find(".title a").text().trim();
        const uploader = $(element).find(".videoUploaderBlock a").text().trim();
        const views = $(element).find('.views').text().trim().replace("views", '');
        const duration = $(element).find(".duration").text().trim();
        
        results.push({
          link: "https://www.pornhub.com" + videoLink,
          title: videoTitle,
          uploader: uploader,
          views: views,
          duration: duration
        });
      }
    });
    
    if (results.length === 0) {
      return { status: false, message: 'No results found' };
    }

    return { status: true, results: results };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

app.get('/api/search/ph-search', async (req, res) => {
  const apikey = req.query.apikey; // دریافت کلید API
  const query = req.query.text; // دریافت متن جستجو

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  if (!query) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No search query provided.'
    });
  }

  keyData.used += 1;

  try {
    const result = await phSearch(query);

    if (!result.status) {
      return res.status(200).json({
        status: false,
        creator: 'Nothing-Ben',
        result: result.message
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.json({
      status: true,
      creator: 'Nothing-Ben',
      result: result.results
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching search results',
      error: error.message
    });
  }
});
//SWEB CAPTURE 3 MERHOD
//1 FULL
app.get('/api/tools/ssweb-full', async (req, res) => {
  const apikey = req.query.apikey;
  const url = req.query.url;

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  if (!url) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No URL provided.'
    });
  }

  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // درخواست به Google PageSpeed API برای اسکرین‌شات کامل
    const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${encodeURIComponent(url)}`);
    const screenshotData = response.data.lighthouseResult?.["fullPageScreenshot"]?.["screenshot"]?.["data"];
    
    if (!screenshotData) {
      return res.status(500).json({
        status: false,
        creator: 'Nothing-Ben',
        result: 'Failed to fetch screenshot data.'
      });
    }

    const buffer = Buffer.from(screenshotData.replace(/^data:image\/webp;base64,/, ""), 'base64');
    res.set('Content-Type', 'image/webp');
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching screenshot.',
      error: error.message
    });
  }
});
//2 DESKTOP
app.get('/api/tools/ssweb-pc', async (req, res) => {
  const apikey = req.query.apikey;
  const url = req.query.url;

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  if (!url) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No URL provided.'
    });
  }

  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // شبیه‌سازی دسکتاپ
    const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${encodeURIComponent(url)}&strategy=desktop`);
    const screenshotData = response.data.lighthouseResult?.["fullPageScreenshot"]?.["screenshot"]?.["data"];
    
    if (!screenshotData) {
      return res.status(500).json({
        status: false,
        creator: 'Nothing-Ben',
        result: 'Failed to fetch screenshot data.'
      });
    }

    const buffer = Buffer.from(screenshotData.replace(/^data:image\/webp;base64,/, ""), 'base64');
    res.set('Content-Type', 'image/webp');
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching screenshot.',
      error: error.message
    });
  }
});
//3 PHONE
app.get('/api/tools/ssweb-phone', async (req, res) => {
  const apikey = req.query.apikey;
  const url = req.query.url;

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  if (!url) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No URL provided.'
    });
  }

  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // شبیه‌سازی موبایل
    const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${encodeURIComponent(url)}&strategy=mobile`);
    const screenshotData = response.data.lighthouseResult?.["fullPageScreenshot"]?.["screenshot"]?.["data"];
    
    if (!screenshotData) {
      return res.status(500).json({
        status: false,
        creator: 'Nothing-Ben',
        result: 'Failed to fetch screenshot data.'
      });
    }

    const buffer = Buffer.from(screenshotData.replace(/^data:image\/webp;base64,/, ""), 'base64');
    res.set('Content-Type', 'image/webp');
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching screenshot.',
      error: error.message
    });
  }
});
//4 TABLET
app.get('/api/tools/ssweb-tablet', async (req, res) => {
  const apikey = req.query.apikey;
  const url = req.query.url;

  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  if (!url) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No URL provided.'
    });
  }

  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // شبیه‌سازی تبلت
    const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${encodeURIComponent(url)}&strategy=desktop`);
    const screenshotData = response.data.lighthouseResult?.["fullPageScreenshot"]?.["screenshot"]?.["data"];
    
    if (!screenshotData) {
      return res.status(500).json({
        status: false,
        creator: 'Nothing-Ben',
        result: 'Failed to fetch screenshot data.'
      });
    }

    const buffer = Buffer.from(screenshotData.replace(/^data:image\/webp;base64,/, ""), 'base64');
    res.set('Content-Type', 'image/webp');
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching screenshot.',
      error: error.message
    });
  }
});
//FONT TXT
app.get('/api/tools/font-txt', async (req, res) => {
  const apikey = req.query.apikey;  // دریافت کلید API
  const text = req.query.text;      // دریافت متن

  // بررسی کلید API و محدودیت‌های آن
  if (!apikey || !apiKeys[apikey]) {
    return res.status(401).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Invalid or missing API key.'
    });
  }

  const keyData = checkUserLimit(apikey);

  // بررسی استفاده از محدودیت
  if (keyData.used >= keyData.limit) {
    return res.status(403).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Limit exceeded for this key.'
    });
  }

  // بررسی عدم ارسال query
  if (!text) {
    return res.status(400).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'No text provided.'
    });
  }

  // افزایش مقدار `used` و ذخیره‌سازی
  keyData.used += 1;
  saveApiKeys(apiKeys);

  try {
    // درخواست برای تبدیل متن به فونت‌های مختلف
    const response = await axios.get(`http://qaz.wtf/u/convert.cgi?text=${encodeURIComponent(text)}`);
    const $ = cheerio.load(response.data);
    const fonts = [];

    // استخراج فونت‌ها از صفحه
    $("table > tbody > tr").each((index, element) => {
      fonts.push({
        name: $(element).find("td:nth-child(1) > span").text(),
        result: $(element).find("td:nth-child(2)").text().trim(),
      });
    });

    // ارسال خروجی به صورت JSON با استفاده از JSON.stringify
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: true,
      creator: 'Nothing-Ben',
      type: "font",
      apikey: apikey, // کلید API
      result: fonts,
    }, null, 2));  // فرمت‌بندی JSON با فاصله 4

  } catch (error) {
    res.status(500).json({
      status: false,
      creator: 'Nothing-Ben',
      result: 'Error fetching font conversion.',
      error: error.message
    });
  }
});
//QR CODE MAKER
app.get('/api/tools/qrcode', async (req, res) => {
    const apikey = req.query.apikey; // دریافت کلید API
    const text = req.query.text; // متن برای تولید QR Code

    if (!apikey || !apiKeys[apikey]) {
        return res.status(401).json({
            status: false,
            result: 'Invalid or missing API key.'
        });
    }

    const keyData = checkUserLimit(apikey);
    if (keyData.used >= keyData.limit) {
        return res.status(403).json({
            status: false,
            result: 'API key usage limit exceeded.'
        });
    }

    if (!text) {
        return res.status(400).json({
            status: false,
            result: 'No text provided.'
        });
    }

    keyData.used += 1;
    saveApiKeys(apiKeys);

    try {
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
        
        // درخواست تصویر QR Code
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        // ارسال تصویر
        res.setHeader('Content-Type', 'image/png');
        res.send(response.data);
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error generating QR code.',
            error: err.message
        });
    }
});
// راه‌اندازی سرور
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
