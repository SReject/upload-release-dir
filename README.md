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
`uploaded` as JSON-String  
&nbsp;&nbsp;A JSON-String containing an array for each successful upload formatted as:
```
{
    path as string - The absolute path of the file
    url as string  - the download URL for the uploaded asset
}
```

`errored` as JSON-String  
&nbsp;&nbsp;A JSON-String containing an array for each failed upload formatted as:
```
{
    path as string  - The absolute path of the file
    error as string - The error message of what went wrong
}
```

### Fails on
- Invalid Directory
- No files to upload
- Invalid release asset upload url
- Any file that failed to upload

## Example - Uploads multiple files
*todo*

## Contributing
*todo*

## License
The scripts and documentation of this project are released under the [ISC License](LICENSE)

