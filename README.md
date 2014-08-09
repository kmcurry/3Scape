
3Scape is a way to unlock your imagination by making and sharing interactive, 3D stories over the web.


#Installation/Setup for Windows

1. Download [3Scape] (http://github.com/3Scape) from our github 

2. Activate Internet Information Services (IIS) 
  * Open Control Panel
  * Search for Programs and Features 
  * Click Turn Window Features on or off
  * Check the folder named Internet Information Services & click OK 
  
3. Adding 3Scape into IIS
  * Open IIS and click the carat to your localhost, click again on sites to see "Default Web Site" 
  * Right click on Default Web Site and select Add Application
  * Enter the directory where 3Scape is located under Physical path
  * Set your alias as 3Scape (anything works but 3Scape is easiest) 
  * Select the name of your alias in the hierarchy and select directory browsing
  * Click enable on the right hand side 
  
   Adding 3Scape into XAMPP 
  * Turn on Apache and place the 3Scape folder into xampp/htdocs/ 
  * Access the default html document with the address  http://localhost/3scape/default.htm

4. Trying it out 
  * Open your browser of choice and type in localhost/*youralias*/ 
  
#Installation/Setup with Node 
 1. Install Node.js
    * Go to the [Node](http://nodejs.org) website to install node.js

 2. Install MongoDB
    * Go to the [MongoDB](http://mongodb.org) website and install MongoDB
 
 3. Setting up the environment
    * First run MongoDB by opening your command prompt and going to the bin file.
      The default for Windows would be "C:\Program Files\MongoDB 2.6 Standard\bin"
    * Run the command mongod.exe to start the mongo database 
    *Now open a second command prompt (in Git Shell preferably) and go to the directory where 3Scape is located. 
     Enter the command node server.js
    *You should see "the magic happens on port `port`. In your browser and type in `hostname`/`port` and voila!

    Note: You need the Mongo command prompt to be on at all times when working on 3Scape


##TroubleShooting 

 1. Restarting the Default Website in IIS  
   *Click on your default website and select "Restart" on the right side 
  
 2. Adding the .lwo MIME type 
    * With 3Scape selected in IIS, double click MIME types and search for the extension ".lwo"
    * If it is not there click "Add". Under File name extension type ".lwo" and in MIME type insert "image-x/lwo"  
 
 3. Giving IIS full access permissions 
    * Right click on 3Scape and select edit permissions and select the Security tab
    * Click Edit then Add 
    * Type in the following: IIS_IUSRS and hit OK
    * Select IIS_IUSRS in group and users then ,under Permissions, select Full Controll 
    * Click Apply then OK.
    * 
    Note:
    You may have to add another permission in order for the #3 to work properly.
    Simply repeat the steps in #3, but instead type IUSR
    
   


