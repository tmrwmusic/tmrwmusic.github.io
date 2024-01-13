async function loadResources() {
    var releases = await fetch("r/releases.json").then(response => response.json());
    var artists = await fetch("a/artists.json").then(response => response.json());
    setLatestRelease(releases, artists)
}

function setLatestRelease(releases, artists) {
    const latestRelease = releases[releases.length - 1];
    const latestReleaseHTML = document.querySelector("latestreleasebanner");

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

    let totalDurationInSeconds = 0;

    latestRelease.tracks.forEach(track => {
        const durationComponents = track.length.split(':');
        const trackDurationInSeconds = parseInt(durationComponents[0]) * 60 + parseInt(durationComponents[1]);
        totalDurationInSeconds += trackDurationInSeconds;
    });

    const totalHours = Math.floor(totalDurationInSeconds / 3600);
    const remainingSeconds = totalDurationInSeconds % 3600;
    const totalMinutes = Math.floor(remainingSeconds / 60);
    const totalSeconds = remainingSeconds % 60;
    
    let formattedDuration = '';
    if (totalHours > 0) {
        formattedDuration += `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
    } else {
        formattedDuration += `${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
    };
    
    latestReleaseHTML.querySelector("cover").style.background = "url(r/res/cvr/" + latestRelease.id + ".png)";
    latestReleaseHTML.querySelector("id").innerHTML = '<a href="/r/' + latestRelease.id + '">' + latestRelease.id + '</a>';
    latestReleaseHTML.querySelector("reltitle").innerHTML = '<a href="/r/' + latestRelease.id + '">' + latestRelease.title + '</a>';
    latestReleaseHTML.querySelector("relartist").innerHTML = artistsList;
    latestReleaseHTML.querySelector("extrainfo").querySelector("type").textContent = latestRelease.type;
    latestReleaseHTML.querySelector("extrainfo").querySelector("dateofrel").textContent = new Date(latestRelease.release.date).toLocaleString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'});
    latestReleaseHTML.querySelector("extrainfo").querySelector("playtime").textContent = formattedDuration;
    document.querySelector("html").style.setProperty("--LATESTRELEASEPrimaryColor", latestRelease.colors[0]);
    document.querySelector("html").style.setProperty("--LATESTRELEASESecondaryColor", latestRelease.colors[1]);
}