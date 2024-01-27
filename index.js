async function loadResources() {
    var releases = await fetch("r/releases.json").then(response => response.json());
    var artists = await fetch("a/artists.json").then(response => response.json());
    var songs = await fetch("/s/songs.json").then(response => response.json());
    setLatestRelease(releases, artists, songs);
    setUpcomingRelease(releases, artists, songs);
}

function setLatestRelease(releases, artists, songs) {
    const today = new Date().toISOString().split('T')[0];
    const filteredReleases = releases.filter(release => release.release.date <= today);
    const latestRelease = filteredReleases[filteredReleases.length - 1];
    const latestReleaseHTML = document.querySelector("latestreleasebanner");

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
    latestReleaseHTML.classList.remove("unloaded");
}

function setUpcomingRelease(releases, artists, songs) {
    const today = new Date().toISOString().split('T')[0];
    const upcomingReleases = releases.filter(release => release.release.date >= today);
    const firstUpcomingRelease = upcomingReleases[0];
    const upcomingReleaseHTML = document.querySelector("upcomingreleasebanner");

    if (!firstUpcomingRelease) {
        upcomingReleaseHTML.classList.add("inactive")
        return;
    }
    if (firstUpcomingRelease.tracks.some(trackId => songs[trackId].explicit === true)) {
        upcomingReleaseHTML.classList.add("explicit");
    }

    let artistsList = "";

    firstUpcomingRelease.artist.main.forEach(artist => {
        artistsList += '<artistmain><a href="/a/' + artists[artist][0].portfolioLINK + '">' + artist + '</a></artistmain>'
    });

    firstUpcomingRelease.artist.featured.forEach(artist => {
        artistsList += '<artistfeat><a href="/a/' + artists[artist][0].portfolioLINK + '">' + artist + '</a></artistfeat>'
    });

    let totalDurationInSeconds = 0;

    firstUpcomingRelease.tracks.forEach(trackId => {
        const track = songs[trackId];
    
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
    
    upcomingReleaseHTML.querySelector("cover").style.background = "url(r/res/cvr/" + firstUpcomingRelease.id + ".png)";
    upcomingReleaseHTML.querySelector("id").innerHTML = '<a href="/r/' + firstUpcomingRelease.id + '">' + firstUpcomingRelease.id + '</a>';
    upcomingReleaseHTML.querySelector("reltitle").innerHTML = '<a href="/r/' + firstUpcomingRelease.id + '">' + firstUpcomingRelease.title + '</a>';
    upcomingReleaseHTML.querySelector("relartist").innerHTML = artistsList;
    upcomingReleaseHTML.querySelector("extrainfo").querySelector("type").textContent = firstUpcomingRelease.type;
    upcomingReleaseHTML.querySelector("extrainfo").querySelector("dateofrel").textContent = new Date(firstUpcomingRelease.release.date).toLocaleString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'});
    upcomingReleaseHTML.querySelector("extrainfo").querySelector("playtime").textContent = formattedDuration;
    upcomingReleaseHTML.classList.remove("unloaded");

    function updateCountdown(endTime) {
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset() * 60000;
        const localNow = new Date(now + timezoneOffset);
        const difference = endTime - localNow;
      
        if (difference <= 0) {
          // Release time reached
          clearInterval(countdownInterval);
            loadResources();
          return;
        }
      
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
        upcomingReleaseHTML.querySelector('countdown').textContent = `${days}:${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    
    const countdownInterval = setInterval(() => {
        updateCountdown(new Date(new Date("2024-02-14").valueOf() + 3*3600*1000));
      }, 100);
}