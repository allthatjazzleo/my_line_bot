const axios = require('axios');
const cheerio = require('cheerio');




//獲取前幾頁的urls
const getBeautyPageLink = async (pageCount = 3) => {
    try{
        const firstPage = 'https://www.ptt.cc/bbs/Beauty/index.html'
        const response = await axios.get(firstPage)
        const $ = cheerio.load(response.data)
        const prev = $('.btn-group-paging a').eq(1).attr('href').match(/\d+/)[0]
        
        const pages = []
        for (var  i = 0; i < pageCount; i++ ) {
            if (i === 0) {
                pages.push(firstPage)
            }else {
                pages.push(`https://www.ptt.cc/bbs/Beauty/index${prev - i + 1}.html`)
            }
            
        }
        return pages
        
        // return [firstPage,`https://www.ptt.cc/bbs/Beauty/index${prev}.html`,`https://www.ptt.cc/bbs/Beauty/index${prev - 1}.html`]
    }catch (e){
        console.log(e.message)
        throw new Error(`can not beauty ptt pages`)
    }
}


//獲取前三頁符合的所有文章 url
const getBeautyPageArticles = async (pages) => {
    // const pagesPromises = pages.map(pageUrl => {
    //     return axios.get(pageUrl)
    // })
    try{
        let totalArticle = []
        const allPagesHtmlResponse = []
        for (let pageUrl of pages ) {
            try {
                const result = await axios.get(pageUrl)
                allPagesHtmlResponse.push(result)
            }catch (e) {
                console.log(e.message)
            }
        }
        //const allPagesHtmlResponse = await Promise.all(pagesPromises)
        
        allPagesHtmlResponse.forEach((response,i) => {
            const $ = cheerio.load(response.data)
            const resultArray = getTallyArticlesOfPage($)
            totalArticle = totalArticle.concat(resultArray)
        })
        // console.log(totalArticle)
        return totalArticle
    }catch (e){
        console.log(e.message)
        throw new Error(`can not beauty ptt pages`)
    }
}

const getTallyArticlesOfPage = ($)=> {
    const articles = $('.r-ent')
    const tallyArticlesArray = []
    
    articles.each((i,result) => {
        //Filter Value
        const rateString = $(result).find('.nrec').find('span').text().trim()
        if (rateString !== '爆') {
            if (isNaN(rateString)) { return }
        }
        let rate
        if (rateString === '爆') {
            rate = 100
        }else {
            rate = Number(rateString)
        }
        if (rate < 30) { return }
        //Filter Title
        const title = $(result).find('.title').find('a').text().trim()
        if (!title.includes('[正妹]') && !title.includes('[神人]')) { return }
        // console.log(rate)
        // console.log(title)
        const href = $(result).find('.title').find('a').attr('href')
        const articleLink = `https://www.ptt.cc` + href
        // console.log(articleLink)
        
        const timeStamp = articleLink.substr(32,10)
        const article_date = new Date(timeStamp * 1000)
        
        const date = $(result).find('.meta').find('.date').text().trim()
        // console.log(date)
        const author = $(result).find('.meta').find('.author').text().trim()
        // console.log(author)
        tallyArticlesArray.push({title, date, author, articleLink , rate, article_date})
    })
    return tallyArticlesArray
}

const getDetailsOfArticles = async (articles) => {
    //const {title, date, author, articleLink , rate} = Articles
    let finalImageDetailArray = []
    for (let article of articles) {
        const {title, date, author, articleLink , rate,article_date} = article
        try {
            const response = await axios.get(articleLink)
            //直接解析body 符合正則
            const mactchArray = response.data.match(/imgur.com\/[0-9a-zA-Z]{7}/g)
            //去掉重複
            const partImagesUrls = [ ...new Set(mactchArray) ]
            //組成final object array
            const imageUrls = partImagesUrls.map(partUrl => {
                //const imageUrl = 'https://' + partUrl + '.jpg'
                return 'https://' + partUrl + '.jpg'
            })
            
            finalImageDetailArray.push({title, date, author, articleLink , rate, imageUrls,article_date})
            
        }catch (e){
            console.log(`cant get response:${articleLink}`);
            console.log(e.message)
            // throw new Error(`cant get response:${articleLink}`)
        }
        
    }
    
    return finalImageDetailArray
}


const getBeautyPageResult = async (count = 3) => {
    try {
        const links = await getBeautyPageLink(count)
        const articlesLinks = await getBeautyPageArticles(links)
        const finalResultArray = await getDetailsOfArticles(articlesLinks)
        return finalResultArray
    }catch (e) {
        throw e
    }
}


getBeautyPageResult().then(result => {
    console.log(result)
}).catch(e => {
    console.log(e.message)
})


module.exports = {
    getBeautyPageResult
}

// module.exports.getBeautyPageResult = getBeautyPageResult