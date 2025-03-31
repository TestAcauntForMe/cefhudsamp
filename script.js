function changeWeapon(weaponType) {
    currentWeapon = weaponType;
    const weaponImage = document.getElementById('weaponImage');
    if (currentWeapon === 'pistol') {
        weaponImage.src = 'images/pistol.png';
    } else {
        weaponImage.src = 'images/fist.png';
    }
}