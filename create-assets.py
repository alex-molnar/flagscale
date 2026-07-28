from PIL import Image, ImageChops
from requests import get
from io import BytesIO
from json import load

with open('input.json', 'r') as f:
    data = load(f)

failed_greyscales = ['turks-and-caicos-islands', 'curaçao', 'saint-pierre-and-miquelon', 'anguilla', 'argentina', 'austria', 'belize', 'greenland', 'the-gambia', 'norfolk-island', 'american-samoa', 'bolivia', 'caribbean-netherlands', 'aruba', 'us-virgin-islands', 'angola', 'australia', 'belgium', 'antigua-and-barbuda', 'benin', 'democratic-republic-of-the-congo', 'cook-islands', 'british-virgin-islands', 'montserrat', 'republic-of-congo', 'western-sahara', 'isle-of-man', 'puerto-rico', 'saint-helena', 'bahamas', 'vanuatu', 'new-caledonia', 'mauritania', 'palestine', 'french-guiana', 'armenia', 'guam', 'federated-states-of-micronesia', 'algeria', 'cayman-islands', 'sint-maarten', 'gibraltar', 'bhutan', 'hong-kong', 'botswana', 'barbados', "cote-d'ivoire", 'andorra', 'french-polynesia', 'guinea', 'united-states', 'brunei-darussalam', 'tokelau', 'belarus', 'bahrain', 'georgia', 'portugal', 'bosnia-and-herzegovina', 'northern-mariana-islands', 'niue', 'bermuda', 'wallis-and-futuna', 'czechia', 'azerbaijan', 'falkland-islands', 'timor-leste', 'bangladesh', 'eritrea']
failed_inverts    = ['turks-and-caicos-islands', 'curaçao', 'saint-pierre-and-miquelon', 'anguilla', 'argentina', 'austria', 'belize', 'greenland', 'the-gambia', 'norfolk-island', 'american-samoa', 'bolivia', 'caribbean-netherlands', 'aruba', 'us-virgin-islands', 'angola', 'australia', 'belgium', 'antigua-and-barbuda', 'benin', 'democratic-republic-of-the-congo', 'cook-islands', 'british-virgin-islands', 'montserrat', 'republic-of-congo', 'western-sahara', 'isle-of-man', 'puerto-rico', 'saint-helena', 'bahamas', 'vanuatu', 'new-caledonia', 'mauritania', 'palestine', 'french-guiana', 'armenia', 'guam', 'federated-states-of-micronesia', 'algeria', 'cayman-islands', 'sint-maarten', 'gibraltar', 'bhutan', 'hong-kong', 'botswana', 'barbados', "cote-d'ivoire", 'andorra', 'french-polynesia', 'guinea', 'united-states', 'brunei-darussalam', 'tokelau', 'belarus', 'bahrain', 'georgia', 'portugal', 'bosnia-and-herzegovina', 'northern-mariana-islands', 'niue', 'bermuda', 'wallis-and-futuna', 'czechia', 'azerbaijan', 'falkland-islands', 'timor-leste', 'bangladesh', 'eritrea']

failures = []

for country in data.values():
    try:
        name = country['name'].lower().replace(' ', '-')
        response = get(f'https://www.countryflags.com/wp-content/uploads/{name}-flag-png-large.png')
        if response.status_code == 200:
            bytes = BytesIO(response.content)
            grayscale_img = Image.open(bytes).convert('L')
            grayscale_img.save(f'assets/grayscale/{name}.png')
            print(f'Successfully created grayscale image for {name}')
            img = Image.open(bytes)
            inv_img = ImageChops.invert(img)
            inv_img.save(f'assets/inverted/{name}.png')
            print(f'Successfully created inverted image for {name}')
            img.save(f'assets/original/{name}.png')
            print(f'Successfully created original image for {name}')
        else:
            print(f'Failed to create inverted/grayscaled image for {name}: HTTP {response.status_code}')
            failures.append(name)
    except Exception as e:
        print(f'Failed to create inverted/grayscaled image for {name}: {e}')
        failures.append(name)

print(failures)