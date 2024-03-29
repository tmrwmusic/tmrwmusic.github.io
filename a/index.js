async function loadResources() {
    const currentArtist = window.location.pathname.split("/")[window.location.pathname.split("/").length - 2];
    var releases = await fetch("/r/releases.json").then(response => response.json());
    var artists = await fetch("/a/artists.json").then(response => response.json());
    var songs = await fetch("/s/songs.json").then(response => response.json());

    let artistName = null;
    for (const name in artists) {
        const artistData = artists[name];
        const foundArtist = artistData.find(artist => artist.portfolioLINK === currentArtist);

        if (foundArtist) {
            artistName = name;
            break;
        }
    }

    var artistReleases = releases.filter(release => {
        const mainArtists = release.artist.main;
        const featuredArtists = release.artist.featured;

        return mainArtists.includes(artistName) || (featuredArtists && featuredArtists.includes(artistName));
    });

    setTimeout(setLatestRelease(artistReleases, artists, songs), 3000);
    setTimeout(showReleases(artistReleases, artists, songs), 3000);
}

function setLatestRelease(releases, artists, songs) {
    const today = new Date().toISOString().split('T')[0];

    // Filter releases to include only those with release dates before or equal to today
    const filteredReleases = releases.filter(release => release.release.date <= today);

    // Treat the last item in the filtered array as the latest release
    const latestRelease = filteredReleases[filteredReleases.length - 1];
    const latestReleaseHTML = document.querySelector("newest");

    if (latestRelease.tracks.some(trackId => songs[trackId].explicit === true)) {
        latestReleaseHTML.classList.add("explicit");
    }

    let artistsList = "";

    latestRelease.artist.main.forEach(artist => {
        artistsList += '<artistmain><a href="/a/' + artists[artist][0].portfolioLINK + '">' + artist + '</a></artistmain>'
    });

    latestRelease.artist.featured.forEach(artist => {
        artistsList += '<artistfeat><a href="/a/' + artists[artist][0].portfolioLINK + '">' + artist + '</a></artistfeat>'
    });

    let totalDurationInSeconds = 0;

    latestRelease.tracks.forEach(trackId => {
        const track = songs[trackId];
    
        const durationComponents = track.length.split(':');
        const trackDurationInSeconds = parseInt(durationComponents[0]) * 60 + parseInt(durationComponents[1]);
        totalDurationInSeconds += trackDurationInSeconds;
    });

    const totalHours = Math.floor(totalDurationInSeconds / 3600);
    const remainingSeconds = totalDurationInSeconds % 3600;
    const totalMinutes = Math.floor(remainingSeconds / 60);
    const totalSeconds = remainingSeconds % 60;
    
    // Construct the formatted duration string (h:mm:ss)
    let formattedDuration = '';
    if (totalHours > 0) {
        formattedDuration += `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
    } else {
        formattedDuration += `${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
    };

    let tracksHTML = "";
    if (latestRelease.tracks.length > 1) {
        latestRelease.tracks.forEach(trackId => {
            const track = songs[trackId];

            var artistsList = "";
            if (track.explicit == true) {
                var ratingTag = ' class="explicit"';
            } else if (track.explicit == false) {
                var ratingTag = ' class="clean"';
            } else if (track.explicit == null) {
                var ratingTag = '';
            }

            track.artist.main.forEach(artist => {
                artistsList += '<artistmain><a href="/a/' + artists[artist][0].portfolioLINK + '">' + artist + '</a></artistmain>';
            });

            track.artist.featured.forEach(artist => {
                artistsList += '<artistfeat><a href="/a/' + artists[artist][0].portfolioLINK + '">' + artist + '</a></artistfeat>';
            });

            tracksHTML += `<reltrack${ratingTag}><left><index>${latestRelease.tracks.indexOf(trackId) + 1}</index><data><name>${track.title}</name><artists>${artistsList}</artists></data></left><right><playtime>${track.length}</playtime></right></reltrack>`;
        });
    }
    

    
    latestReleaseHTML.querySelector("cover").style.background = "url(/r/res/cvr/" + latestRelease.id + ".png)";
    latestReleaseHTML.querySelector("id").innerHTML = '<a href="/r/' + latestRelease.id + '">' + latestRelease.id + '</a>';
    latestReleaseHTML.querySelector("reltitle").innerHTML = '<a href="/r/' + latestRelease.id + '">' + latestRelease.title + '</a>';
    latestReleaseHTML.querySelector("relartist").innerHTML = artistsList;
    latestReleaseHTML.querySelector("extrainfo").querySelector("type").textContent = latestRelease.type;
    latestReleaseHTML.querySelector("extrainfo").querySelector("dateofrel").textContent = new Date(latestRelease.release.date).toLocaleString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'});
    latestReleaseHTML.querySelector("extrainfo").querySelector("playtime").textContent = formattedDuration;
    if (latestRelease.tracks.length > 1) {
        latestReleaseHTML.querySelector("tracks").innerHTML = tracksHTML;
    } else {
        latestReleaseHTML.querySelector("tracks").remove();
        latestReleaseHTML.querySelector("rel + hr").remove();
    };
    latestReleaseHTML.style.setProperty("--RELEASEPrimaryColor", latestRelease.colors[0]);
    latestReleaseHTML.style.setProperty("--RELEASESecondaryColor", latestRelease.colors[1]);
    latestReleaseHTML.classList.remove("unloaded");
}

function showReleases(releases, artists) {
    const today = new Date().toISOString().split('T')[0];

    // Filter releases to include only those with release dates before or equal to today
    const filteredReleases = releases.filter(release => release.release.date <= today);
    const olderReleasesArray = filteredReleases.slice(0, -1).reverse();
    var pageHTML = document.querySelector("body").querySelector("page");

    olderReleasesArray.forEach((release) => {
        let releaseHTML = document.createElement("release");
        if (release.tracks.some(track => track.explicit === true)) {
            releaseHTML.classList.add("explicit");
        };
        releaseHTML.innerHTML += "<id><a href='/r/" + release.id + "'>" + release.id + "</a></id>";
        releaseHTML.innerHTML += "<reltitle><a href='/r/" + release.id + "'>" + release.title + "</a></reltitle>";

        let artistsList = "";

        release.artist.main.forEach(artist => {
            artistsList += '<artistmain><a href="/a/' + artists[artist][0].portfolioLINK + '">' + artist + '</a></artistmain>'
        });

        release.artist.featured.forEach(artist => {
            artistsList += '<artistfeat><a href="/a/' + artists[artist][0].portfolioLINK + '">' + artist + '</a></artistfeat>'
        });

        releaseHTML.innerHTML += "<relartist>" + artistsList + "</relartist>";

        releaseHTML.style.setProperty("--RELEASEPrimaryColor", release.colors[0]);
        releaseHTML.style.setProperty("--RELEASESecondaryColor", release.colors[1]);
        releaseHTML.style.backgroundImage = "url(/r/res/cvr/" + release.id + ".png)";
        pageHTML.appendChild(releaseHTML);
    })
}