# GitHub Action - Upload Directory Contents as Release Assets
This is a work in progress, please be patient

This GitHub Action enables a user to upload all files from a directory as release assets

## Usage

### Inputs
`url` as String  
&nbsp;&nbsp;The release asset URL of which to upload files.  

`dir` as String  
&nbsp;&nbsp;The path of the directory to upload.

`walk` as Boolean - Optional: Defaults to false  
&nbsp;&nbsp;If true, subdirectory files will be uploaded aswell. Please note if files share the same name the action will end in error.

### Outputs
`result` as JSON-String  
The result is a JSON-parsable string representing an array of results for each file uploaded

The JSON string is formatted as:
```
[
    // For a successful upload
    {
        status: "ok" - Literal "ok" indicating the upload was successful
        path: <String> - The absolute path to the file
        name: <String> - The asset name that was used
        id: <Number> - The id of the asset
        url: <String> - The URL to download the asset
    },
    
    // For a failed upload
    {
        status: "error" - Literal "error" indicating the upload failed
        path: <String> - The absolute path to the file
        name: <String> - The asset name used when attempting to upload
        error: <String> - The error message of what failed
    },

    // ...
]
```

### Example - Uploads multiple files
*todo*

### Contributing
*todo*

### License
The scripts and documentation of this project are released under the [ISC License](LICENSE)

