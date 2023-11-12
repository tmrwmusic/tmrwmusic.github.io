async function loadResources() {
    var releases = await fetch("releases.json").then(response => response.json());
    var artists = await fetch("/a/artists.json").then(response => response.json());
    setLatestRelease(releases, artists);
}

function setLatestRelease(releases, artists) {
    const latestRelease = releases[releases.length - 1];
    console.log(latestRelease);
    const latestReleaseHTML = document.querySelector("newest");

    if (latestRelease.tracks.some(track => track.explicit === true)) {
        latestReleaseHTML.classList.add("explicit");
    };

    latestReleaseHTML.querySelector("cover").style.background = "url(/r/res/cvr/" + latestRelease.id + ".png)";
    latestReleaseHTML.querySelector("reltitle").textContent = latestRelease.title;
    latestReleaseHTML.querySelector("relartist").textContent = latestRelease.artist;
    latestReleaseHTML.querySelector("extrainfo").querySelector("type").textContent = latestRelease.type;
    latestReleaseHTML.querySelector("extrainfo").querySelector("dateofrel").textContent = latestRelease.release.date.toLocaleString();
    latestReleaseHTML.style.background = latestRelease.colors[0];
    latestReleaseHTML.style.color = latestRelease.colors[1];
    latestReleaseHTML.classList.remove("unloaded");
}