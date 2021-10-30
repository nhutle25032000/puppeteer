// Write Javascript code here
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


const URL = "https://www.nhaccuatui.com/playlist/top-20-ban-nhac-tre-remix-duoc-nghe-nhieu-nhat-2019-va.axi9gRs09M85.html";

request(URL, function (err, res, body) {
	if(err)
	{
		console.log(err);
	}
	else
	{
		const arr = [];
		let $ = cheerio.load(body);
		$("#idScrllSongInAlbum > li[id ^= 'itemSong_']").each(function (index) {
			
			const data = $(this).find("meta[itemprop = 'url']").attr('content');
			const name = $(this).find("meta[itemprop = 'name']").attr('content');
			const obj = {
				data : data,
				name : name
			};
			
			arr.push(JSON.stringify(obj));
		});

		/***
		 * lưu tên, url của danh sach bài hát
		 */
		let strArr = arr.toString();
		fs.writeFile('data.txt', strArr, function (err) {
			if(err) {
				console.log(err);
			}
			else{
				console.log("get name and URL success");
			}
		});

		/**
		 * lưu toàn bộ nội dung trang
		 */
		let bodyHTML = $('body').html();
		fs.writeFile('contentBodyHTML.txt', bodyHTML, function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log('coppy body html success');
			}
		});

		/**
		 * lưu lời của từng bài hát
		 */
		arr.forEach(element => {
			var song = JSON.parse(element);
			request(song.data, function (err, res, body) {
				if (err) {
					console.log(err);
				} else {
					let $ = cheerio.load(body);
					let oneSongLyric = $("p[id = 'divLyric']").html().replace(/\<br\>/g, "");;
					
					fs.writeFile(`songLyric/${song.name}.txt`, oneSongLyric, function (err) {
						if (err) {
							console.log(err);
						} else {
							console.log(`write file ${song.name}.txt success`);
						}
					})
				}
			});
		});
	}
});
