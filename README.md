
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
    
    
#Reference Models 
1. Here are some ideas of the kind of feel we want to capture with 3Scape
  * [Google Presentation] (https://docs.google.com/presentation/d/10zfW9MqQ2XwvuePpfwbyMDsJmNhrtWYPYszwVk47XGo/edit)
  * [Prezi] (http://www.prezi.com)
  * [Powerpoint] (http://office.microsoft.com/en-us/powerpoint/) "on steroids"
  * [ESRI ArcGIS Explorer] (http://kcurry.blogs.bridgeborn.com/esris-killer-feature/) 

2. Things we don't want 3Scape to be (i.e. a 3D modeling tool)
  * [Three.js Editor] (http://threejs.org/editor/)
  * [Blender] (http://www.blender.org/)


