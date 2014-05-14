
3Scape is a way to unlock your imagination by making and sharing interactive, 3D scapes over the web.


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


