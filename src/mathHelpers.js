
let five_mil = 5000000
let mil = 1000000
let ten_k = 10000
let k = 1000

function mathDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres
    return Math.round(d / 1000)
}

function getDirectionClass(angle) {
    if (angle <= 22.5 && angle >= -22.5) {
        return "⬇️"
    } else if(angle < -22.5 && angle > -67.5) {
        return "↘️"
    } else if (angle <= -67.5 && angle >= -112.5) {
        return "➡️"
    } else if (angle < -112.5 && angle > -157.5) {
        return "↗️"
    } else if (angle <= -157.5 || angle >= 157.5) {
        return "⬆️"
    } else if (angle < 157.5 && angle > 112.5) {
        return "↖️"
    } else if (angle <= 112.5 && angle >= 67.5) {
        return "⬅️"
    } else if (angle < 67.5 && angle > 22.5) {
        return "↙️"
    }
    return "❔"
}