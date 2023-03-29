
const puppeteer = require('puppeteer');
const fs = require('fs');
async function getData() {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    await page.goto('https://github.com/trending');


    await page.waitForSelector(".Box-row");


    const repoDet = await page.evaluate(function(){
        const repo = Array.from(document.querySelectorAll(".Box-row"));

        var repo_arr = [];

        var repoName =  repo.forEach((repo)=>{
            var titleData =  repo.querySelector("h1").innerText;
            var descriptionData = "";
            if(repo.querySelector("p")){
                descriptionData = repo.querySelector("p").innerText;
            }

            var urlData = "";
            var starurl = "";
            if(repo.querySelector("h1 > a")){
                urlData = repo.querySelector("h1 > a").href;
                starurl = repo.querySelector("h1 > a").getAttribute('href');
            }
            var forkurl = "";
            forkurl = starurl + "/forks";
            starurl = starurl + "/stargazers";
            var starsData = "";
            if(repo.querySelector(`a[href = '${starurl}']`)){
                starsData = repo.querySelector(`a[href = '${starurl}']`).innerText ;
            }

            var languageData = "";
            if(repo.querySelector("span[itemprop='programmingLanguage']")){
                languageData = repo.querySelector("span[itemprop='programmingLanguage']").innerText;
            }

            var forksData = "";
            if(repo.querySelector(`a[href = '${forkurl}']`)){
                forksData = repo.querySelector(`a[href = '${forkurl}']`).innerText;
            }

           
           
            
            repo_arr.push({title:titleData,
                description:descriptionData,
                url:urlData,
                language:languageData,
                Stars:starsData,
                forks:forksData});
            
        })

       
        
        

        return repo_arr;

        
    })   

    fs.writeFile("./repo.json", JSON.stringify(repoDet), (err) => {
        if (err) {
        console.log(err);
        }else{
            console.log("Data saved to repo.json");
        }
    }); 

   var devTab = await page.$("a[ href='/trending/developers']");
   await devTab.click();

   await page.waitForSelector("a[href='/trending/developers/javascript?since=daily']");

   await page.evaluate(()=>{
    return document.querySelector("a[href='/trending/developers/javascript?since=daily']").click();
   })


   var developer = await page.evaluate(()=>{

    var dev_arr = [];
    
    const repo = Array.from(document.querySelectorAll(".Box-row"));


    repo.forEach((repo)=>{

        var developerName = "";
        if(repo.querySelector(".h3")){
            developerName =  repo.querySelector(".h3").innerText;
        }

        var popular_repo = "";

        if(repo.querySelector(".h4")){
            popular_repo = repo.querySelector(".h4").innerText;
        }
        
        var description = "";
        if(repo.querySelectorAll(".f6")[2]){
            description = repo.querySelectorAll(".f6")[2].innerText;
        } 
        

        dev_arr.push({developer:developerName,
            Repo:popular_repo,
            description:description});
    })

    return dev_arr;
   })

   fs.writeFile("./DeveloperDetails.json", JSON.stringify(developer), (err) => {
    if (err) {
        console.log(err);
        }else{
            console.log("Data saved to repo.json");
        }
    });

   

    console.log(repoDet);
    console.log(developer);

}

getData();

