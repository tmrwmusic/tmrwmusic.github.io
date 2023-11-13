async function loadResources() {
    var releases = await fetch("releases.json").then(response => response.json());
    var artists = await fetch("/a/artists.json").then(response => response.json());
    setTimeout(setLatestRelease(releases, artists), 3000)
}

function setLatestRelease(releases, artists) {
    const latestRelease = releases[releases.length - 1];
    console.log(latestRelease);
    const latestReleaseHTML = document.querySelector("newest");

    if (latestRelease.tracks.some(track => track.explicit === true)) {
        latestReleaseHTML.classList.add("explicit");
    };

    let artistsList = "";

    latestRelease.artist.main.forEach(artist => {
        artistsList += '<artistmain><a href="/a/' + artists[artist][0].portfolioLINK + '">' + artist + '</a></artistmain>'
    });

    latestRelease.artist.featured.forEach(artist => {
        artistsList += '<artistfeat><a href="/a/' + artists[artist][0].portfolioLINK + '">' + artist + '</a></artistfeat>'
    });

    latestReleaseHTML.querySelector("cover").style.background = "url(/r/res/cvr/" + latestRelease.id + ".png)";
    latestReleaseHTML.querySelector("id").innerHTML = '<a href="/r/' + latestRelease.id + '">' + latestRelease.id + '</a>';
    latestReleaseHTML.querySelector("reltitle").innerHTML = '<a href="/r/' + latestRelease.id + '">' + latestRelease.title + '</a>';
    latestReleaseHTML.querySelector("relartist").innerHTML = artistsList;
    latestReleaseHTML.querySelector("extrainfo").querySelector("type").textContent = latestRelease.type;
    latestReleaseHTML.querySelector("extrainfo").querySelector("dateofrel").textContent = latestRelease.release.date.toLocaleString();
    latestReleaseHTML.style.background = latestRelease.colors[0];
    latestReleaseHTML.style.color = latestRelease.colors[1];
    latestReleaseHTML.classList.remove("unloaded");
}