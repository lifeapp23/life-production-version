const fs = require('fs');

// Paths to your two files containing the meal names
const fileOnePath = 'C:\\Users\\ahmed\\OneDrive\\Documentos\\health-backend-test-one\\main_data\\folderImageNames.json'; // Update this path
const fileTwoPath = 'C:\\Users\\ahmed\\OneDrive\\Documentos\\health-backend-test-one\\main_data\\mainMealsDataImagesList.json'; // Update this path

// Read the first file
fs.readFile(fileOnePath, 'utf8', (err, data1) => {
    if (err) {
        console.error('Error reading first file:', err);
        return;
    }

    // Read the second file
    fs.readFile(fileTwoPath, 'utf8', (err, data2) => {
        if (err) {
            console.error('Error reading second file:', err);
            return;
        }

        // Parse the JSON data into arrays
        const listOne = JSON.parse(data1);
        const listTwo = JSON.parse(data2);

        // Find differences between the two lists
        const uniqueToFirst = listOne.filter(name => !listTwo.includes(name));
        const uniqueToSecond = listTwo.filter(name => !listOne.includes(name));
        const uniqueNames = [...uniqueToFirst, ...uniqueToSecond];

        // Save the unique names to a new file
        const outputPath = 'C:\\Users\\ahmed\\OneDrive\\Documentos\\health-backend-test-one\\main_data\\comparedLists.json'; // Update this path
        fs.writeFile(outputPath, JSON.stringify(uniqueNames, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                //console.log('Unique meal names have been saved to the new file!');
            }
        });
    });
});
