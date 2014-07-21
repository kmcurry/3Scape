function Base() 
{
    this.userData = "";
    this.className = "";
}

Base.prototype.destroy = function()
{
    delete this;
}

function Allocator()
{
}

Allocator.prototype.allocate = function()
{
    return null;
}
function loadBinaryResource(url)
{
    var req = new XMLHttpRequest();
    
    req.open('GET', url, false);
    req.overrideMimeType('text/plain; charset=x-user-defined');
    req.send();
    
    if (req.status != 200)
    {
        return null;
    }
    
    return req.responseText;
}

function loadXMLResource(url)
{
    var req = new XMLHttpRequest();
 
    req.open('GET', url, false);
    req.overrideMimeType('text/plain; charset=x-user-defined');    
    req.send();
    
    if (req.status != 200)
    {
        return null;
    }
    
    return req.responseText;
}

function loadTextResource(url)
{
    var req = new XMLHttpRequest();
 
    req.open('GET', url, false);
    req.overrideMimeType('text/plain; charset=x-user-defined');    
    req.send();
    
    if (req.status != 200)
    {
        return null;
    }
    
    return req.responseText;
}

function isLower(c)
{
    var ascii = c.charCodeAt(0);
    return (ascii > 96 && ascii < 123);
}

function isUpper(c)
{
    var ascii = c.charCodeAt(0);
    return (ascii > 64 && ascii < 91);
}

function isSpace(c)
{
    if (c == ' '  || 
        c == '\f' ||
        c == '\n' ||
        c == '\r' ||
        c == '\t' ||
        c == '\v')
        return true;
        
    return false;
}

// From: http://blog.magnetiq.com/post/514962277/finding-out-class-names-of-javascript-objects
/* Returns the class name of the argument or undefined if
   it's not a valid JavaScript object.
*/
function getObjectClassName(obj) {
    if (obj && obj.constructor && obj.constructor.toString) {
        var arr = obj.constructor.toString().match(
            /function\s*(\w+)/);

        if (arr && arr.length == 2) {
            return arr[1];
        }
    }

    return undefined;
}

/*  takes string to an absolute or relative URL 
    returns an array containing a valid Bw path
    and the expected content directory.
    DOES NOT ENSURE CONTENT EXISTS
    Treat is like our best guess
*/
function formatPath(url)
{
    var result = [];
    
    var validPath = "";
    var validDir  = "";
    
    try {
        $.ajax({
            url: url,
            type:'HEAD',
            async: false,
            error: function()
            {
                console.debug(url + " does not exist.");
                // could be a relative path
                var href = document.location.href;
                
                validPath = href.substring(0, href.lastIndexOf("/")) + "/" + bridgeworks.contentDir + "/" + url;
                
                console.debug("Trying: " + validPath);
                
                var ndx = validPath.lastIndexOf("objects/");
                if (ndx == -1) ndx = validPath.lastIndexOf("motions/");
                if (ndx == -1) ndx = validPath.lastIndexOf("envelopes/");
                if (ndx == -1) ndx = validPath.lastIndexOf("scenes/");
                
                validDir = validPath.substring(0, ndx);
                
                console.debug("With contentDir: " + validDir);  
            },
            success: function()
            {
                validPath = url;
                
                var ndx = validPath.lastIndexOf("objects/");
                if (ndx == -1) ndx = validPath.lastIndexOf("motions/");
                if (ndx == -1) ndx = validPath.lastIndexOf("envelopes/");
                if (ndx == -1) ndx = validPath.lastIndexOf("scenes/");
                
                validDir = validPath.substring(0, ndx);
                
                console.debug("File found: " + validPath);
            }
        });
        
        result[0] = validPath;
        result[1] = validDir;
    } catch (e) {
        
    }
    
    return result;
}

/**
 * Determine if the filename represents a full path.
 * @params filePath     - the filename [path] string.
 * @return bool         - boolean indicating if the filename represents a full path.
 */
function isFullPath(filePath)
{
    // check for // or \\ in beginning of pathname (UNC filename)
    var unc = false;
    var filePathLen = filePath.length;
    if (filePathLen >= 2)
    {
        if ((filePath[0] == '\\' || filePath[0] == '/') &&
            (filePath[1] == '\\' || filePath[1] == '/'))
        {
            unc = true;
        }
    }       

    // check if file path is a full path
    if (unc || filePath.indexOf(':') >= 0)
    {
        return true;
    }

    return false;
}

/**
 * Form a full path string by appending a filename [path] to a directory path.
 * @params filePath     - the filename [path] string.
 * @params dirPath      - the directory path string.
 * @return string       - the output string.
 */
function formFullPath(filePath, dirPath)
{
    var fullPath = new String();

    if (!filePath || !dirPath)
    {
        return null;
    }      

    // check if file path is already a full path
    if (isFullPath(filePath))
    {
        fullPath = filePath;
    }
    else // file path is relative, formulate full path
    {
        fullPath = dirPath;
        if (fullPath.length > 0)
        {
            var last = fullPath.charAt(fullPath.length - 1);
            if (last != '/' && last != '\\')
            {
                fullPath += '/';
            }
        }
        
        // don't allow "//" in the filepath (Minefield doesn't like that)
        if (filePath[0] == '/' || filePath[0] == "\\")
        {
            fullPath += filePath.slice(1);
        }
        else
        {
            fullPath += filePath;
        }
    }

    return fullPath;
}

function getFileExtension(filename)
{
    var ext = null;
    var lastDot = filename.lastIndexOf(".");
    if (lastDot != -1)
    {
        var ext = "";
        ext = filename.substr(lastDot+1)
        return ext;
    }

    return ext;    
}

function getBrowserName()
{
    var browser = new String(navigator.userAgent);
    
    // chrome
    if (browser.indexOf("Chrome") >= 0) return "Chrome";

    // firefox
    if (browser.indexOf("Firefox") >= 0) return "Firefox";

    return undefined;
}

function OutputDebugMsg(msg)
{
    var innerHTML = document.getElementById("DebugOutput").innerHTML;
    innerHTML += "&gt; " + msg + "<br>";
    document.getElementById("DebugOutput").innerHTML = innerHTML;
}
function Color()
{
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
}

Color.prototype.v = function()
{
    var values = [ this.r, this.g, this.b, this.a ];
    return values; 
}

Color.prototype.load = function(r, g, b, a)
{
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

Color.prototype.copy = function(color)
{
    if (color)
    {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    }
}

function Pair(first, second)
{
    this.first = first;
    this.second = second;
}

function Rect(left, top, right, bottom)
{
    this.left = left || 0;
    this.top = top || 0;
    this.right = right || 0;
    this.bottom = bottom || 0;
}

Rect.prototype.load = function(left, top, right, bottom)
{
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
}

Rect.prototype.loadRect = function(rect)
{
    this.left = rect.left;
    this.top = rect.top;
    this.right = rect.right;
    this.bottom = rect.bottom;
}

function Viewport()
{
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    
    this.equals = function(rhs)
    {
        return (this.x == rhs.x &&
                this.y == rhs.y &&
                this.width == rhs.width &&
                this.height == rhs.height); 
    }
}

Viewport.prototype.load = function(x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Viewport.prototype.loadViewport = function(vp)
{
    this.x = vp.x;
    this.y = vp.y;
    this.width = vp.width;
    this.height = vp.height;
}

Viewport.prototype.containsPoint = function(x, y)
{
    if (x >= this.x &&
        y >= this.y &&
        x <= (this.x + this.width) &&
        y <= (this.y + this.height))
        return true;

    return false;
}
function Stack(element)
{
    this.stack = new Array();
    
    if (element)
    {
        this.stack.push(element);
    }
}

Stack.prototype.push = function(element)
{
    this.stack.push(element);
}

Stack.prototype.pop = function()
{
    if (this.stack.length > 0)
    {
        this.stack.pop();
    }
}

Stack.prototype.load = function(element)
{
    this.pop(); // does nothing if empty
    this.push(element);
}

Stack.prototype.top = function()
{
    if (this.stack.length > 0)
    {
        return this.stack[this.stack.length-1];
    }
    
    return null;
}

Stack.prototype.getAt = function(index)
{
    if (this.stack.length > index)
    {
        return this.stack[index];
    }
    
    return null;
}

Stack.prototype.length = function()
{
    return this.stack.length;
}

Stack.prototype.empty = function()
{
    return this.stack.length == 0;
}

Stack.prototype.clear = function()
{
    this.stack.length = 0;
}

Stack.prototype.copy = function()
{
    return this.stack.slice();
}
var gAttributeBin = null;
var gAttributePairs = null;

function setAttributeBin(bin)
{
    gAttributeBin = bin;
}

function setAttributePairs(pairs)
{
    gAttributePairs = pairs;
}

function deserializeAttributeContainer(container, atts)
{
    for (var i=0; i < atts.length; i++)
    {
        var attribute = container.getAttribute(atts[i][0]);
        if (attribute)
        {
            deserializeAttribute(attribute, atts[i][1]);
        }
    }
}

function deserializeComplexAttribute(attribute, atts)
{
    var values = [];
    for (var i=0; i < atts.length; i++)
    {
        values.push(atts[i][1]);
    }
    if (values.length > 0) 
    {
        if (!gAttributeBin)
        {
            setAttributeValue(attribute, values);
        }
        else // gAttributeBin != null
        {
            gAttributeBin.push(new Pair(attribute, values));
        }
    }
}

function deserializeAttribute(attribute, value)
{
    // TODO: search value for operators
    
    if (!gAttributeBin)
    {
        setAttributeValue(attribute, value);
    }
    else // gAttributeBin != null
    {
        gAttributeBin.push(new Pair(attribute, value));
    }
}

function resolveAttributeContainerReference(container, atts, registry)
{
    if (atts.length > 0)
    {
        if (atts[0][0] == "ref")
        {
            var resource = registry.find(atts[0][1]);
            if (resource)
            {
                container.synchronize(resource, true);
                return true;
            } 
        }
    }
    
    return false;
}

function resolveComplexAttributeReference(attribute, atts)
{
    if (atts.length > 0)
    {
        if (atts[0][0] == "ref")
        {
            return resolvePrimitiveAttributeReference(attribute, atts[0][1]);
        }
    }

    return false;
}

function resolvePrimitiveAttributeReference(attribute, value)
{
    // TODO
    return false;
}

function resolveAttributeReference(source, target)
{
    if (!gAttributePairs)
    {
        target.copyValue(source);
    }
    else // gAttributePairs != null
    {
        gAttributePairs.push(new Pair(source, target));
    }
}
// =========================================================================
//
// xmlsax.js - an XML SAX parser in JavaScript.
//
// version 3.1
//
// =========================================================================
//
// Copyright (C) 2001 - 2002 David Joham (djoham@yahoo.com) and Scott Severtson
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.

// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.

// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//
//
// Visit the XML for <SCRIPT> home page at http://xmljs.sourceforge.net
//

// CONSTANTS

// =========================================================================
// =========================================================================
// =========================================================================
var whitespace = "\n\r\t ";


/***************************************************************************************************************
XMLP is a pull-based parser. The calling application passes in a XML string
to the constructor, then repeatedly calls .next() to parse the next segment.
.next() returns a flag indicating what type of segment was found, and stores
data temporarily in couple member variables (name, content, array of
attributes), which can be accessed by several .get____() methods.

Basically, XMLP is the lowest common denominator parser - an very simple
API which other wrappers can be built against.
*****************************************************************************************************************/


XMLP = function(strXML) {
    /*******************************************************************************************************************
    function:   this is the constructor to the XMLP Object

    Author:   Scott Severtson

    Description:
        Instantiates and initializes the object
    *********************************************************************************************************************/
    // Normalize line breaks
    strXML = SAXStrings.replace(strXML, null, null, "\r\n", "\n");
    strXML = SAXStrings.replace(strXML, null, null, "\r", "\n");

    this.m_xml = strXML;
    this.m_iP = 0;
    this.m_iState = XMLP._STATE_PROLOG;
    this.m_stack = new saxStack();
    this._clearAttributes();

}  // end XMLP constructor


// CONSTANTS    (these must be below the constructor)

// =========================================================================
// =========================================================================
// =========================================================================

XMLP._NONE    = 0;
XMLP._ELM_B   = 1;
XMLP._ELM_E   = 2;
XMLP._ELM_EMP = 3;
XMLP._ATT     = 4;
XMLP._TEXT    = 5;
XMLP._ENTITY  = 6;
XMLP._PI      = 7;
XMLP._CDATA   = 8;
XMLP._COMMENT = 9;
XMLP._DTD     = 10;
XMLP._ERROR   = 11;

XMLP._CONT_XML = 0;
XMLP._CONT_ALT = 1;

XMLP._ATT_NAME = 0;
XMLP._ATT_VAL  = 1;

XMLP._STATE_PROLOG = 1;
XMLP._STATE_DOCUMENT = 2;
XMLP._STATE_MISC = 3;

XMLP._errs = new Array();
XMLP._errs[XMLP.ERR_CLOSE_PI       = 0 ] = "PI: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_DTD      = 1 ] = "DTD: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_COMMENT  = 2 ] = "Comment: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_CDATA    = 3 ] = "CDATA: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_ELM      = 4 ] = "Element: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_ENTITY   = 5 ] = "Entity: missing closing sequence";
XMLP._errs[XMLP.ERR_PI_TARGET      = 6 ] = "PI: target is required";
XMLP._errs[XMLP.ERR_ELM_EMPTY      = 7 ] = "Element: cannot be both empty and closing";
XMLP._errs[XMLP.ERR_ELM_NAME       = 8 ] = "Element: name must immediatly follow \"<\"";
XMLP._errs[XMLP.ERR_ELM_LT_NAME    = 9 ] = "Element: \"<\" not allowed in element names";
XMLP._errs[XMLP.ERR_ATT_VALUES     = 10] = "Attribute: values are required and must be in quotes";
XMLP._errs[XMLP.ERR_ATT_LT_NAME    = 11] = "Element: \"<\" not allowed in attribute names";
XMLP._errs[XMLP.ERR_ATT_LT_VALUE   = 12] = "Attribute: \"<\" not allowed in attribute values";
XMLP._errs[XMLP.ERR_ATT_DUP        = 13] = "Attribute: duplicate attributes not allowed";
XMLP._errs[XMLP.ERR_ENTITY_UNKNOWN = 14] = "Entity: unknown entity";
XMLP._errs[XMLP.ERR_INFINITELOOP   = 15] = "Infininte loop";
XMLP._errs[XMLP.ERR_DOC_STRUCTURE  = 16] = "Document: only comments, processing instructions, or whitespace allowed outside of document element";
XMLP._errs[XMLP.ERR_ELM_NESTING    = 17] = "Element: must be nested correctly";

// =========================================================================
// =========================================================================
// =========================================================================


XMLP.prototype._addAttribute = function(name, value) {
    /*******************************************************************************************************************
    function:   _addAttribute

    Author:   Scott Severtson
    *********************************************************************************************************************/
    this.m_atts[this.m_atts.length] = new Array(name, value);
}  // end function _addAttribute


XMLP.prototype._checkStructure = function(iEvent) {
    /*******************************************************************************************************************
    function:   _checkStructure

    Author:   Scott Severtson
    *********************************************************************************************************************/
  
	if(XMLP._STATE_PROLOG == this.m_iState) {
		if((XMLP._TEXT == iEvent) || (XMLP._ENTITY == iEvent)) {
            if(SAXStrings.indexOfNonWhitespace(this.getContent(), this.getContentBegin(), this.getContentEnd()) != -1) {
				return this._setErr(XMLP.ERR_DOC_STRUCTURE);
            }
        }

        if((XMLP._ELM_B == iEvent) || (XMLP._ELM_EMP == iEvent)) {
            this.m_iState = XMLP._STATE_DOCUMENT;
            // Don't return - fall through to next state
        }
    }
    if(XMLP._STATE_DOCUMENT == this.m_iState) {
        if((XMLP._ELM_B == iEvent) || (XMLP._ELM_EMP == iEvent)) {
            this.m_stack.push(this.getName());
        }

        if((XMLP._ELM_E == iEvent) || (XMLP._ELM_EMP == iEvent)) {
            var strTop = this.m_stack.pop();
            if((strTop == null) || (strTop != this.getName())) {
                return this._setErr(XMLP.ERR_ELM_NESTING);
            }
        }

        if(this.m_stack.count() == 0) {
            this.m_iState = XMLP._STATE_MISC;
            return iEvent;
        }
    }
    if(XMLP._STATE_MISC == this.m_iState) {
		if((XMLP._ELM_B == iEvent) || (XMLP._ELM_E == iEvent) || (XMLP._ELM_EMP == iEvent) || (XMLP.EVT_DTD == iEvent)) {
			return this._setErr(XMLP.ERR_DOC_STRUCTURE);
        }

        if((XMLP._TEXT == iEvent) || (XMLP._ENTITY == iEvent)) {
			if(SAXStrings.indexOfNonWhitespace(this.getContent(), this.getContentBegin(), this.getContentEnd()) != -1) {
				return this._setErr(XMLP.ERR_DOC_STRUCTURE);
            }
        }
    }

    return iEvent;

}  // end function _checkStructure


XMLP.prototype._clearAttributes = function() {
    /*******************************************************************************************************************
    function:   _clearAttributes

    Author:   Scott Severtson
    *********************************************************************************************************************/
    this.m_atts = new Array();
}  // end function _clearAttributes


XMLP.prototype._findAttributeIndex = function(name) {
    /*******************************************************************************************************************
    function:   findAttributeIndex

    Author:   Scott Severtson
    *********************************************************************************************************************/
    for(var i = 0; i < this.m_atts.length; i++) {
        if(this.m_atts[i][XMLP._ATT_NAME] == name) {
            return i;
        }
    }
    return -1;

}  // end function _findAttributeIndex


XMLP.prototype.getAttributeCount = function() {
    /*******************************************************************************************************************
    function:   getAttributeCount

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.m_atts ? this.m_atts.length : 0;

}  // end function getAttributeCount()


XMLP.prototype.getAttributeName = function(index) {
    /*******************************************************************************************************************
    function:   getAttributeName

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return ((index < 0) || (index >= this.m_atts.length)) ? null : this.m_atts[index][XMLP._ATT_NAME];

}  //end function getAttributeName


XMLP.prototype.getAttributeValue = function(index) {
    /*******************************************************************************************************************
    function:   getAttributeValue

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return ((index < 0) || (index >= this.m_atts.length)) ? null : __unescapeString(this.m_atts[index][XMLP._ATT_VAL]);

} // end function getAttributeValue


XMLP.prototype.getAttributeValueByName = function(name) {
    /*******************************************************************************************************************
    function:   getAttributeValueByName

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.getAttributeValue(this._findAttributeIndex(name));

}  // end function getAttributeValueByName


XMLP.prototype.getColumnNumber = function() {
    /*******************************************************************************************************************
    function:   getColumnNumber

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return SAXStrings.getColumnNumber(this.m_xml, this.m_iP);

}  // end function getColumnNumber


XMLP.prototype.getContent = function() {
    /*******************************************************************************************************************
    function:   getContent

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return (this.m_cSrc == XMLP._CONT_XML) ? this.m_xml : this.m_cAlt;

}  //end function getContent


XMLP.prototype.getContentBegin = function() {
    /*******************************************************************************************************************
    function:   getContentBegin

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.m_cB;

}  //end function getContentBegin


XMLP.prototype.getContentEnd = function() {
    /*******************************************************************************************************************
    function:   getContentEnd

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.m_cE;

}  // end function getContentEnd


XMLP.prototype.getLineNumber = function() {
    /*******************************************************************************************************************
    function:   getLineNumber

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return SAXStrings.getLineNumber(this.m_xml, this.m_iP);

}  // end function getLineNumber


XMLP.prototype.getName = function() {
    /*******************************************************************************************************************
    function:   getName

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.m_name;

}  // end function getName()


XMLP.prototype.next = function() {
    /*******************************************************************************************************************
    function:   next

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this._checkStructure(this._parse());

}  // end function next()


XMLP.prototype._parse = function() {
    /*******************************************************************************************************************
    function:   _parse

    Author:   Scott Severtson
    *********************************************************************************************************************/

	if(this.m_iP == this.m_xml.length) {
        return XMLP._NONE;
    }

    if(this.m_iP == this.m_xml.indexOf("<?",        this.m_iP)) {
        return this._parsePI     (this.m_iP + 2);
    }
    else if(this.m_iP == this.m_xml.indexOf("<!DOCTYPE", this.m_iP)) {
        return this._parseDTD    (this.m_iP + 9);
    }
    else if(this.m_iP == this.m_xml.indexOf("<!--",      this.m_iP)) {
        return this._parseComment(this.m_iP + 4);
    }
    else if(this.m_iP == this.m_xml.indexOf("<![CDATA[", this.m_iP)) {
        return this._parseCDATA  (this.m_iP + 9);
    }
    else if(this.m_iP == this.m_xml.indexOf("<",         this.m_iP)) {
        return this._parseElement(this.m_iP + 1);
    }
    else if(this.m_iP == this.m_xml.indexOf("&",         this.m_iP)) {
        return this._parseEntity (this.m_iP + 1);
    }
    else{
        return this._parseText   (this.m_iP);
    }
	

}  // end function _parse


XMLP.prototype._parseAttribute = function(iB, iE) {
    /*******************************************************************************************************************
    function:   _parseAttribute

    Author:   Scott Severtson
    *********************************************************************************************************************/
    var iNB, iNE, iEq, iVB, iVE;
    var cQuote, strN, strV;

	this.m_cAlt = ""; //resets the value so we don't use an old one by accident (see testAttribute7 in the test suite)
    
	iNB = SAXStrings.indexOfNonWhitespace(this.m_xml, iB, iE);
    if((iNB == -1) ||(iNB >= iE)) {
        return iNB;
    }

    iEq = this.m_xml.indexOf("=", iNB);
    if((iEq == -1) || (iEq > iE)) {
        return this._setErr(XMLP.ERR_ATT_VALUES);
    }

    iNE = SAXStrings.lastIndexOfNonWhitespace(this.m_xml, iNB, iEq);

    iVB = SAXStrings.indexOfNonWhitespace(this.m_xml, iEq + 1, iE);
    if((iVB == -1) ||(iVB > iE)) {
        return this._setErr(XMLP.ERR_ATT_VALUES);
    }

    cQuote = this.m_xml.charAt(iVB);
    if(SAXStrings.QUOTES.indexOf(cQuote) == -1) {
        return this._setErr(XMLP.ERR_ATT_VALUES);
    }

    iVE = this.m_xml.indexOf(cQuote, iVB + 1);
    if((iVE == -1) ||(iVE > iE)) {
        return this._setErr(XMLP.ERR_ATT_VALUES);
    }

    strN = this.m_xml.substring(iNB, iNE + 1);
    strV = this.m_xml.substring(iVB + 1, iVE);

    if(strN.indexOf("<") != -1) {
        return this._setErr(XMLP.ERR_ATT_LT_NAME);
    }

    if(strV.indexOf("<") != -1) {
        return this._setErr(XMLP.ERR_ATT_LT_VALUE);
    }

    strV = SAXStrings.replace(strV, null, null, "\n", " ");
    strV = SAXStrings.replace(strV, null, null, "\t", " ");
	iRet = this._replaceEntities(strV);
    if(iRet == XMLP._ERROR) {
        return iRet;
    }

    strV = this.m_cAlt;

    if(this._findAttributeIndex(strN) == -1) {
        this._addAttribute(strN, strV);
    }
    else {
        return this._setErr(XMLP.ERR_ATT_DUP);
    }

    this.m_iP = iVE + 2;

    return XMLP._ATT;

}  // end function _parseAttribute


XMLP.prototype._parseCDATA = function(iB) {
    /*******************************************************************************************************************
    function:   _parseCDATA

    Author:   Scott Severtson
    *********************************************************************************************************************/
    var iE = this.m_xml.indexOf("]]>", iB);
    if (iE == -1) {
        return this._setErr(XMLP.ERR_CLOSE_CDATA);
    }

    this._setContent(XMLP._CONT_XML, iB, iE);

    this.m_iP = iE + 3;

    return XMLP._CDATA;

}  // end function _parseCDATA


XMLP.prototype._parseComment = function(iB) {
    /*******************************************************************************************************************
    function:   _parseComment

    Author:   Scott Severtson
    *********************************************************************************************************************/
    var iE = this.m_xml.indexOf("-" + "->", iB);
    if (iE == -1) {
        return this._setErr(XMLP.ERR_CLOSE_COMMENT);
    }

    this._setContent(XMLP._CONT_XML, iB, iE);

    this.m_iP = iE + 3;

    return XMLP._COMMENT;

}  // end function _parseComment


XMLP.prototype._parseDTD = function(iB) {
    /*******************************************************************************************************************
    function:  _parseDTD

    Author:   Scott Severtson
    *********************************************************************************************************************/

    // Eat DTD

    var iE, strClose, iInt, iLast;

    iE = this.m_xml.indexOf(">", iB);
    if(iE == -1) {
        return this._setErr(XMLP.ERR_CLOSE_DTD);
    }

    iInt = this.m_xml.indexOf("[", iB);
    strClose = ((iInt != -1) && (iInt < iE)) ? "]>" : ">";

    while(true) {
        // DEBUG: Remove
        if(iE == iLast) {
            return this._setErr(XMLP.ERR_INFINITELOOP);
        }

        iLast = iE;
        // DEBUG: Remove End

        iE = this.m_xml.indexOf(strClose, iB);
        if(iE == -1) {
            return this._setErr(XMLP.ERR_CLOSE_DTD);
        }

        // Make sure it is not the end of a CDATA section
        if (this.m_xml.substring(iE - 1, iE + 2) != "]]>") {
            break;
        }
    }

    this.m_iP = iE + strClose.length;

    return XMLP._DTD;

}  // end function _parseDTD


XMLP.prototype._parseElement = function(iB) {
    /*******************************************************************************************************************
    function:   _parseElement

    Author:   Scott Severtson
    *********************************************************************************************************************/
    var iE, iDE, iNE, iRet;
    var iType, strN, iLast;

    iDE = iE = this.m_xml.indexOf(">", iB);
    if(iE == -1) {
        return this._setErr(XMLP.ERR_CLOSE_ELM);
    }

    if(this.m_xml.charAt(iB) == "/") {
        iType = XMLP._ELM_E;
        iB++;
    } else {
        iType = XMLP._ELM_B;
    }

    if(this.m_xml.charAt(iE - 1) == "/") {
        if(iType == XMLP._ELM_E) {
            return this._setErr(XMLP.ERR_ELM_EMPTY);
        }
        iType = XMLP._ELM_EMP;
        iDE--;
    }

    iDE = SAXStrings.lastIndexOfNonWhitespace(this.m_xml, iB, iDE);

    //djohack
    //hack to allow for elements with single character names to be recognized

    if (iE - iB != 1 ) {
        if(SAXStrings.indexOfNonWhitespace(this.m_xml, iB, iDE) != iB) {
            return this._setErr(XMLP.ERR_ELM_NAME);
        }
    }
    // end hack -- original code below

    /*
    if(SAXStrings.indexOfNonWhitespace(this.m_xml, iB, iDE) != iB)
        return this._setErr(XMLP.ERR_ELM_NAME);
    */
    this._clearAttributes();

    iNE = SAXStrings.indexOfWhitespace(this.m_xml, iB, iDE);
    if(iNE == -1) {
        iNE = iDE + 1;
    }
    else {
        this.m_iP = iNE;
        while(this.m_iP < iDE) {
            // DEBUG: Remove
            if(this.m_iP == iLast) return this._setErr(XMLP.ERR_INFINITELOOP);
            iLast = this.m_iP;
            // DEBUG: Remove End


            iRet = this._parseAttribute(this.m_iP, iDE);
            if(iRet == XMLP._ERROR) return iRet;
        }
    }

    strN = this.m_xml.substring(iB, iNE);

    if(strN.indexOf("<") != -1) {
        return this._setErr(XMLP.ERR_ELM_LT_NAME);
    }

    this.m_name = strN;
    this.m_iP = iE + 1;

    return iType;

}  // end function _parseElement


XMLP.prototype._parseEntity = function(iB) {
    /*******************************************************************************************************************
    function:   _parseEntity

    Author:   Scott Severtson
    *********************************************************************************************************************/
    var iE = this.m_xml.indexOf(";", iB);
    if(iE == -1) {
        return this._setErr(XMLP.ERR_CLOSE_ENTITY);
    }

    this.m_iP = iE + 1;

    return this._replaceEntity(this.m_xml, iB, iE);

}  // end function _parseEntity


XMLP.prototype._parsePI = function(iB) {
    /*******************************************************************************************************************
    function:   _parsePI

    Author:   Scott Severtson
    *********************************************************************************************************************/

    var iE, iTB, iTE, iCB, iCE;

    iE = this.m_xml.indexOf("?>", iB);
    if(iE   == -1) {
        return this._setErr(XMLP.ERR_CLOSE_PI);
    }

    iTB = SAXStrings.indexOfNonWhitespace(this.m_xml, iB, iE);
    if(iTB == -1) {
        return this._setErr(XMLP.ERR_PI_TARGET);
    }

    iTE = SAXStrings.indexOfWhitespace(this.m_xml, iTB, iE);
    if(iTE  == -1) {
        iTE = iE;
    }

    iCB = SAXStrings.indexOfNonWhitespace(this.m_xml, iTE, iE);
    if(iCB == -1) {
        iCB = iE;
    }

    iCE = SAXStrings.lastIndexOfNonWhitespace(this.m_xml, iCB, iE);
    if(iCE  == -1) {
        iCE = iE - 1;
    }

    this.m_name = this.m_xml.substring(iTB, iTE);
    this._setContent(XMLP._CONT_XML, iCB, iCE + 1);
    this.m_iP = iE + 2;

    return XMLP._PI;

}  // end function _parsePI


XMLP.prototype._parseText = function(iB) {
    /*******************************************************************************************************************
    function:   _parseText

    Author:   Scott Severtson
    *********************************************************************************************************************/
    var iE, iEE;

    iE = this.m_xml.indexOf("<", iB);
    if(iE == -1) {
        iE = this.m_xml.length;
    }

    iEE = this.m_xml.indexOf("&", iB);
    if((iEE != -1) && (iEE <= iE)) {
        iE = iEE;
    }

    this._setContent(XMLP._CONT_XML, iB, iE);

    this.m_iP = iE;

    return XMLP._TEXT;

} // end function _parseText


XMLP.prototype._replaceEntities = function(strD, iB, iE) {
    /*******************************************************************************************************************
    function:   _replaceEntities

    Author:   Scott Severtson
    *********************************************************************************************************************/
    if(SAXStrings.isEmpty(strD)) return "";
    iB = iB || 0;
    iE = iE || strD.length;


    var iEB, iEE, strRet = "";

    iEB = strD.indexOf("&", iB);
    iEE = iB;

    while((iEB > 0) && (iEB < iE)) {
        strRet += strD.substring(iEE, iEB);

        iEE = strD.indexOf(";", iEB) + 1;

        if((iEE == 0) || (iEE > iE)) {
            return this._setErr(XMLP.ERR_CLOSE_ENTITY);
        }

        iRet = this._replaceEntity(strD, iEB + 1, iEE - 1);
        if(iRet == XMLP._ERROR) {
            return iRet;
        }

        strRet += this.m_cAlt;

        iEB = strD.indexOf("&", iEE);
    }

    if(iEE != iE) {
        strRet += strD.substring(iEE, iE);
    }

    this._setContent(XMLP._CONT_ALT, strRet);

    return XMLP._ENTITY;

}  // end function _replaceEntities


XMLP.prototype._replaceEntity = function(strD, iB, iE) {
    /*******************************************************************************************************************
    function:   _replaceEntity

    Author:   Scott Severtson
    *********************************************************************************************************************/
    if(SAXStrings.isEmpty(strD)) return -1;
    iB = iB || 0;
    iE = iE || strD.length;

    switch(strD.substring(iB, iE)) {
        case "amp":  strEnt = "&";  break;
        case "lt":   strEnt = "<";  break;
        case "gt":   strEnt = ">";  break;
        case "apos": strEnt = "'";  break;
        case "quot": strEnt = "\""; break;
        default:
            if(strD.charAt(iB) == "#") {
                strEnt = String.fromCharCode(parseInt(strD.substring(iB + 1, iE)));
            } else {
                return this._setErr(XMLP.ERR_ENTITY_UNKNOWN);
            }
        break;
    }
    this._setContent(XMLP._CONT_ALT, strEnt);

    return XMLP._ENTITY;
}  // end function _replaceEntity


XMLP.prototype._setContent = function(iSrc) {
    /*******************************************************************************************************************
    function:   _setContent

    Author:   Scott Severtson
    *********************************************************************************************************************/
    var args = arguments;

    if(XMLP._CONT_XML == iSrc) {
        this.m_cAlt = null;
        this.m_cB = args[1];
        this.m_cE = args[2];
    } else {
        this.m_cAlt = args[1];
        this.m_cB = 0;
        this.m_cE = args[1].length;
    }
    this.m_cSrc = iSrc;

}  // end function _setContent


XMLP.prototype._setErr = function(iErr) {
    /*******************************************************************************************************************
    function:   _setErr

    Author:   Scott Severtson
    *********************************************************************************************************************/
    var strErr = XMLP._errs[iErr];

    this.m_cAlt = strErr;
    this.m_cB = 0;
    this.m_cE = strErr.length;
    this.m_cSrc = XMLP._CONT_ALT;

    return XMLP._ERROR;

}  // end function _setErr






/***************************************************************************************************************
SAXDriver is an object that basically wraps an XMLP instance, and provides an
event-based interface for parsing. This is the object users interact with when coding
with XML for <SCRIPT>
*****************************************************************************************************************/


SAXDriver = function() {
    /*******************************************************************************************************************
    function:   SAXDriver

    Author:   Scott Severtson

    Description:
        This is the constructor for the SAXDriver Object
    *********************************************************************************************************************/
    this.m_hndDoc = null;
    this.m_hndErr = null;
    this.m_hndLex = null;
}


// CONSTANTS    (these must be below the constructor)

// =========================================================================
// =========================================================================
// =========================================================================
SAXDriver.DOC_B = 1;
SAXDriver.DOC_E = 2;
SAXDriver.ELM_B = 3;
SAXDriver.ELM_E = 4;
SAXDriver.CHARS = 5;
SAXDriver.PI    = 6;
SAXDriver.CD_B  = 7;
SAXDriver.CD_E  = 8;
SAXDriver.CMNT  = 9;
SAXDriver.DTD_B = 10;
SAXDriver.DTD_E = 11;
// =========================================================================
// =========================================================================
// =========================================================================



SAXDriver.prototype.parse = function(strD) {
    /*******************************************************************************************************************
    function:   parse

    Author:   Scott Severtson
    *********************************************************************************************************************/
    var parser = new XMLP(strD);

    if(this.m_hndDoc && this.m_hndDoc.setDocumentLocator) {
        this.m_hndDoc.setDocumentLocator(this);
    }

    this.m_parser = parser;
    this.m_bErr = false;

    if(!this.m_bErr) {
        this._fireEvent(SAXDriver.DOC_B);
    }
    this._parseLoop();
    if(!this.m_bErr) {
        this._fireEvent(SAXDriver.DOC_E);
    }

    this.m_xml = null;
    this.m_iP = 0;

}  // end function parse


SAXDriver.prototype.setDocumentHandler = function(hnd) {
    /*******************************************************************************************************************
    function:   setDocumentHandler

    Author:   Scott Severtson
    *********************************************************************************************************************/

    this.m_hndDoc = hnd;

}   // end function setDocumentHandler


SAXDriver.prototype.setErrorHandler = function(hnd) {
    /*******************************************************************************************************************
    function:   setErrorHandler

    Author:   Scott Severtson
    *********************************************************************************************************************/

    this.m_hndErr = hnd;

}  // end function setErrorHandler


SAXDriver.prototype.setLexicalHandler = function(hnd) {
    /*******************************************************************************************************************
    function:   setLexicalHandler

    Author:   Scott Severtson
    *********************************************************************************************************************/

    this.m_hndLex = hnd;

}  // end function setLexicalHandler


    /*******************************************************************************************************************
                                                LOCATOR/PARSE EXCEPTION INTERFACE
    *********************************************************************************************************************/

SAXDriver.prototype.getColumnNumber = function() {
    /*******************************************************************************************************************
    function:   getSystemId

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.m_parser.getColumnNumber();

}  // end function getColumnNumber


SAXDriver.prototype.getLineNumber = function() {
    /*******************************************************************************************************************
    function:   getLineNumber

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.m_parser.getLineNumber();

}  // end function getLineNumber


SAXDriver.prototype.getMessage = function() {
    /*******************************************************************************************************************
    function:   getMessage

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.m_strErrMsg;

}  // end function getMessage


SAXDriver.prototype.getPublicId = function() {
    /*******************************************************************************************************************
    function:   getPublicID

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return null;

}  // end function getPublicID


SAXDriver.prototype.getSystemId = function() {
    /*******************************************************************************************************************
    function:   getSystemId

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return null;

}  // end function getSystemId


    /*******************************************************************************************************************
                                                Attribute List Interface
    *********************************************************************************************************************/

SAXDriver.prototype.getLength = function() {
    /*******************************************************************************************************************
    function:   getLength

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.m_parser.getAttributeCount();

}  // end function getAttributeCount


SAXDriver.prototype.getName = function(index) {
    /*******************************************************************************************************************
    function:   getName

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.m_parser.getAttributeName(index);

} // end function getAttributeName


SAXDriver.prototype.getValue = function(index) {
    /*******************************************************************************************************************
    function:   getValue

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.m_parser.getAttributeValue(index);

}  // end function getAttributeValue


SAXDriver.prototype.getValueByName = function(name) {
    /*******************************************************************************************************************
    function:   getValueByName

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.m_parser.getAttributeValueByName(name);

} // end function getAttributeValueByName


    /*******************************************************************************************************************
                                                                Private functions
    *********************************************************************************************************************/

SAXDriver.prototype._fireError = function(strMsg) {
    /*******************************************************************************************************************
    function:   _fireError

    Author:   Scott Severtson
    *********************************************************************************************************************/
    this.m_strErrMsg = strMsg;
    this.m_bErr = true;

    if(this.m_hndErr && this.m_hndErr.fatalError) {
        this.m_hndErr.fatalError(this);
    }

}   // end function _fireError


SAXDriver.prototype._fireEvent = function(iEvt) {
    /*******************************************************************************************************************
    function:   _fireEvent

    Author:   Scott Severtson
    *********************************************************************************************************************/
    var hnd, func, args = arguments, iLen = args.length - 1;

    if(this.m_bErr) return;

    if(SAXDriver.DOC_B == iEvt) {
        func = "startDocument";         hnd = this.m_hndDoc;
    }
    else if (SAXDriver.DOC_E == iEvt) {
        func = "endDocument";           hnd = this.m_hndDoc;
    }
    else if (SAXDriver.ELM_B == iEvt) {
        func = "startElement";          hnd = this.m_hndDoc;
    }
    else if (SAXDriver.ELM_E == iEvt) {
        func = "endElement";            hnd = this.m_hndDoc;
    }
    else if (SAXDriver.CHARS == iEvt) {
        func = "characters";            hnd = this.m_hndDoc;
    }
    else if (SAXDriver.PI    == iEvt) {
        func = "processingInstruction"; hnd = this.m_hndDoc;
    }
    else if (SAXDriver.CD_B  == iEvt) {
        func = "startCDATA";            hnd = this.m_hndLex;
    }
    else if (SAXDriver.CD_E  == iEvt) {
        func = "endCDATA";              hnd = this.m_hndLex;
    }
    else if (SAXDriver.CMNT  == iEvt) {
        func = "comment";               hnd = this.m_hndLex;
    }

    if(hnd && hnd[func]) {
        if(0 == iLen) {
            hnd[func]();
        }
        else if (1 == iLen) {
            hnd[func](args[1]);
        }
        else if (2 == iLen) {
            hnd[func](args[1], args[2]);
        }
        else if (3 == iLen) {
            hnd[func](args[1], args[2], args[3]);
        }
    }

}  // end function _fireEvent


SAXDriver.prototype._parseLoop = function(parser) {
    /*******************************************************************************************************************
    function:   _parseLoop

    Author:   Scott Severtson
    *********************************************************************************************************************/
    var iEvent, parser;

    parser = this.m_parser;
    while(!this.m_bErr) {
        iEvent = parser.next();

        if(iEvent == XMLP._ELM_B) {
            this._fireEvent(SAXDriver.ELM_B, parser.getName(), this);
        }
        else if(iEvent == XMLP._ELM_E) {
            this._fireEvent(SAXDriver.ELM_E, parser.getName());
        }
        else if(iEvent == XMLP._ELM_EMP) {
            this._fireEvent(SAXDriver.ELM_B, parser.getName(), this);
            this._fireEvent(SAXDriver.ELM_E, parser.getName());
        }
        else if(iEvent == XMLP._TEXT) {
            this._fireEvent(SAXDriver.CHARS, parser.getContent(), parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());
        }
        else if(iEvent == XMLP._ENTITY) {
            this._fireEvent(SAXDriver.CHARS, parser.getContent(), parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());
        }
        else if(iEvent == XMLP._PI) {
            this._fireEvent(SAXDriver.PI, parser.getName(), parser.getContent().substring(parser.getContentBegin(), parser.getContentEnd()));
        }
        else if(iEvent == XMLP._CDATA) {
            this._fireEvent(SAXDriver.CD_B);
            this._fireEvent(SAXDriver.CHARS, parser.getContent(), parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());
            this._fireEvent(SAXDriver.CD_E);
        }
        else if(iEvent == XMLP._COMMENT) {
            this._fireEvent(SAXDriver.CMNT, parser.getContent(), parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());
        }
        else if(iEvent == XMLP._DTD) {
        }
        else if(iEvent == XMLP._ERROR) {
            this._fireError(parser.getContent());
        }
        else if(iEvent == XMLP._NONE) {
            return;
        }
    }

}  // end function _parseLoop



/***************************************************************************************************************
SAXStrings: a useful object containing string manipulation functions
*****************************************************************************************************************/


SAXStrings = function() {
    /*******************************************************************************************************************
    function:   SAXStrings

    Author:   Scott Severtson

    Description:
        This is the constructor of the SAXStrings object
    *********************************************************************************************************************/
}  // end function SAXStrings


// CONSTANTS    (these must be below the constructor)

// =========================================================================
// =========================================================================
// =========================================================================
SAXStrings.WHITESPACE = " \t\n\r";
SAXStrings.QUOTES = "\"'";
// =========================================================================
// =========================================================================
// =========================================================================


SAXStrings.getColumnNumber = function(strD, iP) {
    /*******************************************************************************************************************
    function:   replace

    Author:   Scott Severtson
    *********************************************************************************************************************/
    if(SAXStrings.isEmpty(strD)) {
        return -1;
    }
    iP = iP || strD.length;

    var arrD = strD.substring(0, iP).split("\n");
    var strLine = arrD[arrD.length - 1];
    arrD.length--;
    var iLinePos = arrD.join("\n").length;

    return iP - iLinePos;

}  // end function getColumnNumber


SAXStrings.getLineNumber = function(strD, iP) {
    /*******************************************************************************************************************
    function:   getLineNumber

    Author:   Scott Severtson
    *********************************************************************************************************************/
    if(SAXStrings.isEmpty(strD)) {
        return -1;
    }
    iP = iP || strD.length;

    return strD.substring(0, iP).split("\n").length
}  // end function getLineNumber


SAXStrings.indexOfNonWhitespace = function(strD, iB, iE) {
    /*******************************************************************************************************************
    function:   indexOfNonWhitespace

    Author:   Scott Severtson
    *********************************************************************************************************************/
    if(SAXStrings.isEmpty(strD)) {
        return -1;
    }
    iB = iB || 0;
    iE = iE || strD.length;

    for(var i = iB; i < iE; i++){
        if(SAXStrings.WHITESPACE.indexOf(strD.charAt(i)) == -1) {
            return i;
        }
    }
    return -1;

}  // end function indexOfNonWhitespace


SAXStrings.indexOfWhitespace = function(strD, iB, iE) {
    /*******************************************************************************************************************
    function:   indexOfWhitespace

    Author:   Scott Severtson
    *********************************************************************************************************************/
    if(SAXStrings.isEmpty(strD)) {
        return -1;
    }
    iB = iB || 0;
    iE = iE || strD.length;

    for(var i = iB; i < iE; i++) {
        if(SAXStrings.WHITESPACE.indexOf(strD.charAt(i)) != -1) {
            return i;
        }
    }
    return -1;
}  // end function indexOfWhitespace


SAXStrings.isEmpty = function(strD) {
    /*******************************************************************************************************************
    function:   isEmpty

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return (strD == null) || (strD.length == 0);

}  // end function isEmpty


SAXStrings.lastIndexOfNonWhitespace = function(strD, iB, iE) {
    /*******************************************************************************************************************
    function:   lastIndexOfNonWhiteSpace

    Author:   Scott Severtson
    *********************************************************************************************************************/
    if(SAXStrings.isEmpty(strD)) {
        return -1;
    }
    iB = iB || 0;
    iE = iE || strD.length;

    for(var i = iE - 1; i >= iB; i--){
        if(SAXStrings.WHITESPACE.indexOf(strD.charAt(i)) == -1){
            return i;
        }
    }
    return -1;
}  // end function lastIndexOfNonWhitespace


SAXStrings.replace = function(strD, iB, iE, strF, strR) {
    /*******************************************************************************************************************
    function:   replace

    Author:   Scott Severtson
    *********************************************************************************************************************/
    if(SAXStrings.isEmpty(strD)) {
        return "";
    }
    iB = iB || 0;
    iE = iE || strD.length;

    return strD.substring(iB, iE).split(strF).join(strR);

}  // end function replace



/***************************************************************************************************************
saxStack: A simple stack class, used for verifying document structure.
*****************************************************************************************************************/

saxStack = function() {
    /*******************************************************************************************************************
    function:   saxStack

    Author:   Scott Severtson

    Description:
        Constructor of the saxStack Object
    *********************************************************************************************************************/
    this.m_arr = new Array();

}  // end function saxStack


saxStack.prototype.clear = function() {
    /*******************************************************************************************************************
    function:   clear

    Author:   Scott Severtson
    *********************************************************************************************************************/

    this.m_arr = new Array();

}  // end function clear


saxStack.prototype.count = function() {
    /*******************************************************************************************************************
    function:   count

    Author:   Scott Severtson
    *********************************************************************************************************************/

    return this.m_arr.length;

}  // end function count


saxStack.prototype.destroy = function() {
    /*******************************************************************************************************************
    function:   destroy

    Author:   Scott Severtson
    *********************************************************************************************************************/

    this.m_arr = null;

}   // end function destroy


saxStack.prototype.peek = function() {
    /*******************************************************************************************************************
    function:   peek

    Author:   Scott Severtson
    *********************************************************************************************************************/
    if(this.m_arr.length == 0) {
        return null;
    }

    return this.m_arr[this.m_arr.length - 1];

}  // end function peek


saxStack.prototype.pop = function() {
    /*******************************************************************************************************************
    function:   pop

    Author:   Scott Severtson
    *********************************************************************************************************************/
    if(this.m_arr.length == 0) {
        return null;
    }

    var o = this.m_arr[this.m_arr.length - 1];
    this.m_arr.length--;
    return o;

}  // end function pop


saxStack.prototype.push = function(o) {
    /*******************************************************************************************************************
    function:   push

    Author:   Scott Severtson
    *********************************************************************************************************************/

    this.m_arr[this.m_arr.length] = o;

}  // end function push



// =========================================================================
// =========================================================================
// =========================================================================

// CONVENIENCE FUNCTIONS

// =========================================================================
// =========================================================================
// =========================================================================

function isEmpty(str) {
    /*******************************************************************************************************************
    function: isEmpty

    Author: mike@idle.org

    Description:
        convenience function to identify an empty string

    *********************************************************************************************************************/
    return (str==null) || (str.length==0);

} // end function isEmpty



function trim(trimString, leftTrim, rightTrim) {
    /*******************************************************************************************************************
    function: trim

    Author: may106@psu.edu

    Description:
        helper function to trip a string (trimString) of leading (leftTrim)
        and trailing (rightTrim) whitespace

    *********************************************************************************************************************/
    if (isEmpty(trimString)) {
        return "";
    }

    // the general focus here is on minimal method calls - hence only one
    // substring is done to complete the trim.

    if (leftTrim == null) {
        leftTrim = true;
    }

    if (rightTrim == null) {
        rightTrim = true;
    }

    var left=0;
    var right=0;
    var i=0;
    var k=0;


    // modified to properly handle strings that are all whitespace
    if (leftTrim == true) {
        while ((i<trimString.length) && (whitespace.indexOf(trimString.charAt(i++))!=-1)) {
            left++;
        }
    }
    if (rightTrim == true) {
        k=trimString.length-1;
        while((k>=left) && (whitespace.indexOf(trimString.charAt(k--))!=-1)) {
            right++;
        }
    }
    return trimString.substring(left, trimString.length - right);
} // end function trim

/**
 * function __escapeString
 *
 * author: David Joham djoham@yahoo.com
 *
 * @param  str : string - The string to be escaped
 *
 * @return : string - The escaped string
 */
function __escapeString(str) {

    var escAmpRegEx = /&/g;
    var escLtRegEx = /</g;
    var escGtRegEx = />/g;
    var quotRegEx = /"/g;
    var aposRegEx = /'/g;

    str = str.replace(escAmpRegEx, "&amp;");
    str = str.replace(escLtRegEx, "&lt;");
    str = str.replace(escGtRegEx, "&gt;");
    str = str.replace(quotRegEx, "&quot;");
    str = str.replace(aposRegEx, "&apos;");

  return str;
}

/**
 * function __unescapeString 
 *
 * author: David Joham djoham@yahoo.com
 *
 * @param  str : string - The string to be unescaped
 *
 * @return : string - The unescaped string
 */
function __unescapeString(str) {

    var escAmpRegEx = /&amp;/g;
    var escLtRegEx = /&lt;/g;
    var escGtRegEx = /&gt;/g;
    var quotRegEx = /&quot;/g;
    var aposRegEx = /&apos;/g;

    str = str.replace(escAmpRegEx, "&");
    str = str.replace(escLtRegEx, "<");
    str = str.replace(escGtRegEx, ">");
    str = str.replace(quotRegEx, "\"");
    str = str.replace(aposRegEx, "'");

  return str;
}

// =========================================================================
//
// scripts.js- sample code for the SAX Parser in XML for <SCRIPT>
//
// =========================================================================
//
// Copyright (C) 2001, 2002 - David Joham (djoham@yahoo.com)
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; eithere
// version 2.1 of the License, or (at your option) any later version.

// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.

// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA


/**************************************************************************************
                                        GLOBALS
***************************************************************************************/

var xmlTextArray
var xmlCDataArray
var xmlAttrArray


/**************************************************************************************
                                        FUNCTIONS
***************************************************************************************/

function showTagInfo(xpath){
    /*************************************************************************************
    Function:       void showTagInfo(xpath)

    author:         xwisdom@yahoo.com

    description:
        displays information about a node. Uses the node's xpath info

    ************************************************************************************/

    var textValue;
    var cdataValue;

    textValue = trim(xmlTextArray[xpath]);

    if (textValue == "" || textValue == null) {
        textValue = "No text value for this node";
    }

    cdataValue = trim(xmlCDataArray[xpath]);


    if (cdataValue == "" || cdataValue == null) {
        cdataValue = "No CDATA value for this node";
    }

    var src='Text:\n '+textValue+'\n\n' +'CDATA:\n '+cdataValue +'\n\n'

    if(xmlAttrArray[xpath]){
        var arr=xmlAttrArray[xpath]
        var atts=''
        for (i in arr){
            // name = value
            atts+=i+'='+arr[i]+'\n';
        }
        src+='Attributes:\n '+atts
    }

    alert(xpath+'\n\n'+src)

} // end function showTagInfo


function startParser() {
    /*************************************************************************************
    Function:       void startParser(xmldata)

    author:         xwisdom@yahoo.com

    description:
        starts the sax2 parser

    ************************************************************************************/

    var ixml = document.getElementById("xmldata").value;

    var arr,src='' ,parser = new SAXDriver();
    var handler = new xmlHandler();


    // pass handlers to the sax2 parser
    parser.setDocumentHandler(handler);
    parser.setErrorHandler(handler);
    parser.setLexicalHandler(handler);

    parser.parse(ixml);// start parsing

    // get errors from sax2 parser
    var err='\n'+handler.getError();

    xmlTextArray=handler.getText_Array()
    xmlCDataArray=handler.getCDATA_Array()
    xmlAttrArray=handler.getAttr_Array()

    arr=handler.getPath_Array();
    for (i=0;i<arr.length;i++){
        src+='<a href="javascript:void(null)" onclick="showTagInfo(\''+arr[i]+'\')">'+arr[i]+'</a>\n'
    }

    if(document.all){
        document.all.divout.innerHTML='Parsing completed  | Click on the links below for more info:<br><pre>'+src+'</pre>'
    }else if(document.getElementById){
        document.getElementById('divout').innerHTML='Parsing completed | Click on the links below for more info:<br><pre>'+src+'</pre>'
    }else{
        alert('Requires a DOM compatible browser for this test')
    }

}// end function startParser



/***************************************************************************************
                                        SAX EVENT HANDLER
***************************************************************************************/


xmlHandler = function() {
    /*************************************************************************************
    Function:       xmlHandler

    author:         xwisdom@yahoo.com

    description:
    	constructor for the xmlHandler object

    ************************************************************************************/
    this.m_strError=''
    this.m_treePath=[]
    this.m_xPath=[''] // stores current path info
    this.m_text=['']
    this.m_cdata=['']
    this.m_attr=['']
    this.m_pi=['']
    this.cdata=false

} // end function xmlHandler


xmlHandler.prototype.characters = function(data, start, length) {
    /*************************************************************************************
    Function:       object.characters(String data, Int start, Int length)
					-> data: xml data
					-> start of text/cdata entity
					-> length of text/cdata entity

    author:         xwisdom@yahoo.com

    description:
    	this event is triggered whenever a text/cdata entity is encounter by the sax2 parser

    ************************************************************************************/

    // capture characters from CDATA and Text entities
    var text=data.substr(start, length);
    if (text=='\n' ) return null // get ride of blank text lines
    if (this.m_treePath.length>0){
        if(this.cdata==false){
            if (!this.m_text[this.m_xPath.join('/')]) {
                this.m_text[this.m_xPath.join('/')]='';
            }
            this.m_text[this.m_xPath.join('/')]+=text;
        }
        else {
            if (!this.m_cdata[this.m_xPath.join('/')]) {
                this.m_cdata[this.m_xPath.join('/')]='';
            }
            this.m_cdata[this.m_xPath.join('/')]+=text;
        }
    }

} // end function characters


xmlHandler.prototype.comment = function(data, start, length) {
    /*************************************************************************************
    Function:       object.comment(String data, Int start, Int length)

    author:         xwisdom@yahoo.com

    description:
		triggered whenever a comment <!-- text --> is found. Same as the character event

    ************************************************************************************/

    var comment=data.substr(start, length)

} // end function comment


xmlHandler.prototype.endCDATA = function() {
    /*************************************************************************************
    Function:       object.endCDATA()

    author:         xwisdom@yahoo.com

    description:
    	triggered at the end of cdata entity

    ************************************************************************************/

    // end of CDATA entity
    this.cdata=false

} // end function endCDATA


xmlHandler.prototype.endDocument = function() {
    /*************************************************************************************
    Function:       object.endDocument()

    author:         xwisdom@yahoo.com

    description:
    	end of document parsing - last event triggered by the sax2 parser

    ************************************************************************************/

} // end function end Document


xmlHandler.prototype.endElement = function(name) {
    /*************************************************************************************
    Function:       object.endElement(String tagname)
					-> tagname: name of tag

    author:         xwisdom@yahoo.com

    description:
    	last event trigger when a node is encounter by the sax2 parser

    ************************************************************************************/

    this.m_xPath=this.m_xPath.slice(0,-1);

} // end function endElement

xmlHandler.prototype.error = function(exception) {
    /*************************************************************************************
    Function:       object.error(String exception)

    author:         xwisdom@yahoo.com

    description:
		triggered whenever an error is encounter by the sax2 parser

    ************************************************************************************/

    this.m_strError+='Error:'+exception.getMessage()+'\n'

} // end function error


xmlHandler.prototype.fatalError = function(exception) {
    /*************************************************************************************
    Function:       object.fatalError(String exception)

    author:         xwisdom@yahoo.com

    description:
		triggered whenever an error is encounter by the sax2 parser

    ************************************************************************************/

    this.m_strError+='fatal error:'+exception.getMessage()+'\n'

} // end function fatalError


xmlHandler.prototype.getAttr_Array= function() {
    /*************************************************************************************
    Function:       getAttr_Array

    author:         xwisdom@yahoo.com
    ************************************************************************************/

    return this.m_attr;

}   // end function getAttr_Array


xmlHandler.prototype.getCDATA_Array= function() {
    /*************************************************************************************
    Function:       getCDATA_Array

    author:         xwisdom@yahoo.com
    ************************************************************************************/
    return this.m_cdata;

}  // end function getCDATA_Array


xmlHandler.prototype.getError = function() {
    /*************************************************************************************
    Function:       getError

    author:         xwisdom@yahoo.com
    ************************************************************************************/

    return this.m_strError;

}  // end function getError


xmlHandler.prototype.getPath_Array = function() {
    /*************************************************************************************
    Function:       getError

    author:         xwisdom@yahoo.com
    ************************************************************************************/
	return this.m_treePath;
}  // end function getPath_Array


xmlHandler.prototype.getText_Array = function() {
    /*************************************************************************************
    Function:       getText_Array

    author:         xwisdom@yahoo.com
    ************************************************************************************/
    return this.m_text;

} // getTextArray


xmlHandler.prototype.processingInstruction = function(target, data) {
    /*************************************************************************************
    Function:       object.processingInstruction(String target, String data)
						-> target: is tagname of the pi
						-> data: is the content of the pi

    author:         xwisdom@yahoo.com

    description:
    	capture PI data here

    ************************************************************************************/

} // end function processingInstruction


xmlHandler.prototype.setDocumentLocator = function(locator) {
    /*************************************************************************************
    Function:       object.setDocumentLocator(SAXDriver locator)

    author:         xwisdom@yahoo.com

    description:
		passes an instance of the SAXDriver to the handler

    ************************************************************************************/

    this.m_locator = locator;

}  // end function setDocumentLocator


xmlHandler.prototype.startCDATA = function() {
    /*************************************************************************************
    Function:       object.startCDATA()

    author:         xwisdom@yahoo.com

    description:
    	triggered whenever a cdata entity is encounter by the sax2 parser

    ************************************************************************************/


    // start of CDATA entity
    this.cdata=true

} // end function startCDATA


xmlHandler.prototype.startDocument = function() {
    /*************************************************************************************
    Function:       object.startDocument()

    author:         xwisdom@yahoo.com

    description:
    	start of document - first event triggered by the sax2 parser

    ************************************************************************************/

} // end function startDocument


xmlHandler.prototype.startElement = function(name, atts) {
    /*************************************************************************************
    Function:       object.startElement(String tagname,Array content)
					-> tagname: name of tag
					-> content: [["attribute1", "value1"], ["attribute2", "value2"],....,n]

    author:         xwisdom@yahoo.com

    description:
    	First event trigger when a node is encounter by the sax2 parser
    	the name and attribute contents are passed to this event

    ************************************************************************************/
alert(name);
    // Note: the following code is used to store info about the node
    // into arrays for use the xpath layout

    var cpath,att_count=atts.getLength()
    this.m_xPath[this.m_xPath.length]=name
    cpath=this.m_xPath.join('/')
    this.m_treePath[this.m_treePath.length]=cpath

    if (att_count) {
        var attr=[]
        for (i=0;i<att_count;i++){
            attr[atts.getName(i)]=atts.getValue(i)
        }
        this.m_attr[this.m_xPath.join('/')]=attr;
    }

} // end function startElement


xmlHandler.prototype.warning = function(exception) {
    /*************************************************************************************
    Function:       object.warninng(String exception)

    author:         xwisdom@yahoo.com

    description:
		triggered whenever an error is encounter by the sax2 parser

    ************************************************************************************/

    this.m_strError+='Warning:'+exception.getMessage()+'\n'

} // end function warning


function Timer()
{
    this.startTime = null;
    this.stopTime = null;
}

Timer.prototype.start = function()
{
    var date = new Date();
    
    this.startTime = date.getTime();
}

Timer.prototype.stop = function()
{
    var date = new Date();
    
    this.stopTime = date.getTime();
}

Timer.prototype.getTime = function()
{
    if (this.startTime && this.stopTime)
    {
        return (this.stopTime - this.startTime) / 1000;
    }
        
    return 0;
}
// From: http://www.codeproject.com/KB/scripting/dom-element-abs-pos.aspx

function __getIEVersion()
{
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

function __getOperaVersion()
{
    var rv = 0; // Default value
    if (window.opera)
    {
        var sver = window.opera.version();
        rv = parseFloat(sver);
    }
    return rv;
}

var __userAgent = navigator.userAgent;
var __isIE = navigator.appVersion.match(/MSIE/) != null;
var __IEVersion = __getIEVersion();
var __isIENew = __isIE && __IEVersion >= 8;
var __isIEOld = __isIE && !__isIENew;

var __isFireFox = __userAgent.match(/firefox/i) != null;
var __isFireFoxOld = __isFireFox && ((__userAgent.match(/firefox\/2./i) != null) ||
	(__userAgent.match(/firefox\/1./i) != null));
var __isFireFoxNew = __isFireFox && !__isFireFoxOld;

var __isWebKit = navigator.appVersion.match(/WebKit/) != null;
var __isChrome = navigator.appVersion.match(/Chrome/) != null;
var __isOpera = window.opera != null;
var __operaVersion = __getOperaVersion();
var __isOperaOld = __isOpera && (__operaVersion < 10);

function __parseBorderWidth(width)
{
    var res = 0;
    if (typeof (width) == "string" && width != null && width != "")
    {
        var p = width.indexOf("px");
        if (p >= 0)
        {
            res = parseInt(width.substring(0, p));
        }
        else
        {
            //do not know how to calculate other values 
            //(such as 0.5em or 0.1cm) correctly now
            //so just set the width to 1 pixel
            res = 1;
        }
    }
    return res;
}

//returns border width for some element
function __getBorderWidth(element)
{
    var res = new Object();
    res.left = 0; res.top = 0; res.right = 0; res.bottom = 0;
    if (window.getComputedStyle)
    {
        //for Firefox
        var elStyle = window.getComputedStyle(element, null);
        res.left = parseInt(elStyle.borderLeftWidth.slice(0, -2));
        res.top = parseInt(elStyle.borderTopWidth.slice(0, -2));
        res.right = parseInt(elStyle.borderRightWidth.slice(0, -2));
        res.bottom = parseInt(elStyle.borderBottomWidth.slice(0, -2));
    }
    else
    {
        //for other browsers
        res.left = __parseBorderWidth(element.style.borderLeftWidth);
        res.top = __parseBorderWidth(element.style.borderTopWidth);
        res.right = __parseBorderWidth(element.style.borderRightWidth);
        res.bottom = __parseBorderWidth(element.style.borderBottomWidth);
    }

    return res;
}

//returns the absolute position of some element within document
function getElementAbsolutePos(element)
{
    var res = new Object();
    res.x = 0; res.y = 0;
    if (element !== null)
    {
        if (element.getBoundingClientRect)
        {
            var viewportElement = document.documentElement;
            var box = element.getBoundingClientRect();
            var scrollLeft = viewportElement.scrollLeft;
            var scrollTop = viewportElement.scrollTop;

            res.x = box.left + scrollLeft;
            res.y = box.top + scrollTop;

        }
        else
        { //for old browsers
            res.x = element.offsetLeft;
            res.y = element.offsetTop;

            var parentNode = element.parentNode;
            var borderWidth = null;

            while (offsetParent != null)
            {
                res.x += offsetParent.offsetLeft;
                res.y += offsetParent.offsetTop;

                var parentTagName =
					offsetParent.tagName.toLowerCase();

                if ((__isIEOld && parentTagName != "table") ||
					((__isFireFoxNew || __isChrome) &&
						parentTagName == "td"))
                {
                    borderWidth = kGetBorderWidth
							(offsetParent);
                    res.x += borderWidth.left;
                    res.y += borderWidth.top;
                }

                if (offsetParent != document.body &&
				offsetParent != document.documentElement)
                {
                    res.x -= offsetParent.scrollLeft;
                    res.y -= offsetParent.scrollTop;
                }


                //next lines are necessary to fix the problem 
                //with offsetParent
                if (!__isIE && !__isOperaOld || __isIENew)
                {
                    while (offsetParent != parentNode &&
						parentNode !== null)
                    {
                        res.x -= parentNode.scrollLeft;
                        res.y -= parentNode.scrollTop;
                        if (__isFireFoxOld || __isWebKit)
                        {
                            borderWidth =
						     kGetBorderWidth(parentNode);
                            res.x += borderWidth.left;
                            res.y += borderWidth.top;
                        }
                        parentNode = parentNode.parentNode;
                    }
                }

                parentNode = offsetParent.parentNode;
                offsetParent = offsetParent.offsetParent;
            }
        }
    }
    
    return res;
}
/**
*	The end behavior enumeration
*/
var eEndBehavior =
{
    Reset: 0,
    Constant: 1,
    Repeat: 2,
    Oscillate: 3,
    OffsetRepeat: 4,
    Linear: 5
};

var eImageAntialiasOp =
{
    None: 0,
    TwoPass: 1,
    FourPass: 2,
    EightPass: 3,
    EnumCount: 4
};

/**
 * The key frame shape enumeration
 */
var eKeyframeShape =
{
    Linear: 0,
    Stepped: 1,
    TCB: 2,
    Bezier1D: 3,
    Bezier2D: 4
};

var eTextureType =
{
    // color textures
    Color: 0,
    // diffuse textures
    Diffuse: 1,
    // luminosity (emissive) textures
    Luminosity: 2,
    // reflection textures
    Reflection: 3,
    // specularity textures
    Specularity: 4,
    // transparency textures
    Transparency: 5,
    // clip textures
    Clip: 6,
    // bump textures
    Bump: 7,
    // number of texture types
    EnumCount: 8
};

var eTextureWrap =
{
    // no texture wrapping
    None: 0,
    // clamp texture wrapping
    Clamp: 1,
    // repeat texture wrapping
    Repeat: 2,
    // mirror texture wrapping
    Mirror: 3,
    // number of texture wraps
    EnumCount: 4
};

var FLT_EPSILON = 1.192092896e-07;
var FLT_MAX     = 3.402823466e+38;

var TWOPI     = Math.PI * 2;
var HALFPI    = Math.PI / 2;
var QUARTERPI = Math.PI / 4;

function min3(x, y, z)
{
    return Math.min(x, Math.min(y, z));
}

function max3(x, y, z)
{
    return Math.max(x, Math.max(y, z));
}

function toRadians(degrees)
{
    return degrees * Math.PI / 180;
}

function toDegrees(radians)
{
    return radians * 180 / Math.PI;
}

function magnitude(x, y, z)
{
    return Math.sqrt(((x) * (x)) + ((y) * (y)) + ((z) * (z)));
}

function clamp(value, min, max)
{
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

/*
 * Normalize a degree value so that it falls between [0, 360)
 * @params deg the degree value to normalize
 * @return T the normalized value
 */
function degreeNormalize(deg)
{
    while (deg < 0)
    {
        deg += 360;
    }

    while (deg >=360)
    {
        deg -= 360;
    }

    return deg;
}

function epsilonEqual(value1, value2, epsilon)
{
    if (Math.abs(value1 - value2) < epsilon)
    {
        return true;
    }
    
    return false;
}

function determinant2x2(_11, _12, 
                        _21, _23)
{
    return (_11 * _23) - (_12 * _21);
}

function determinant3x3(_11, _12, _13, 
                        _21, _22, _23,
                        _31, _32, _33)
{
    var a = determinant2x2(_22, _23, _32, _33);
    var b = determinant2x2(_21, _23, _31, _33);
    var c = determinant2x2(_21, _22, _31, _32);
    
    return (_11 * a) - (_12 * b) + (_13 * c);
}
        
function determinant4x4(_11, _12, _13, _14,
                        _21, _22, _23, _24,
                        _31, _32, _33, _34,
                        _41, _42, _43, _44)
{
    var a = determinant3x3(_22, _23, _24, _32, _33, _34, _42, _43, _44);
    var b = determinant3x3(_21, _23, _24, _31, _33, _34, _41, _43, _44);
    var c = determinant3x3(_21, _22, _24, _31, _32, _34, _41, _42, _44);
    var d = determinant3x3(_21, _22, _23, _31, _32, _33, _41, _42, _43);
    
    return (_11 * a) - (_12 * b) + (_13 * c) - (_14 * d);  
}        

function modf(x)
{
    var integerPart = (x < 0 ? Math.ceil(x) : Math.floor(x));
    var fractionalPart = x - integerPart;
    
    return { integerPart: integerPart, fractionalPart: fractionalPart };
}

function XYZtoH(x, y, z)
{
    var heading = 0;
    
    if (x == 0)
    {
        if (z >= 0)
        {
            heading = 0.0;
        }
        else
        {
            heading = Math.PI;
        }
    }
    else if (z == 0)
    {
        if (x >= 0)
        {
            heading = 3 * HALFPI;
        }
        else
        {
            heading = HALFPI;
        }
    }
    else
    {
        if (x > 0 && z > 0) // I
        {
            heading = TWOPI - Math.atan(x / z);
        }
        else if (x < 0 && z > 0) // II
        {
            heading = -Math.atan(x / z);
        }
        else if (x < 0 && z < 0)  // III
        {
            heading = HALFPI + Math.atan(z / x);
        }
        else // (x > 0 && z < 0)  // IV
        {
            heading = 3 * HALFPI + Math.atan(z / x);
        }
    }
    
    return heading;
}

function XYZtoHP(x, y, z)
{
    var heading = 0;
    var pitch = 0;
    
    if (x == 0 && z == 0) 
    {
        heading = 0;
        if (y != 0)
        {
            pitch = (y < 0 ? -HALFPI : HALFPI);
        }
        else
        {
            pitch = 0;
        }
    }
    else 
    {
        if (z == 0)
        {
            heading = (x > 0 ? HALFPI : -HALFPI);
        }
        else if (z < 0)
        {
            heading = -Math.atan(x / z) + Math.PI;
        }
        else
        {
            heading = -Math.atan(x / z);
        }

        x = Math.sqrt(x * x + z * z);

        if (x == 0)
        {
            pitch = (y < 0 ? -HALFPI : HALFPI);
        }
        else
        {
            pitch = Math.atan(y / x);
        }
    }
    
    return { heading: heading, pitch: pitch };
}

function rectContainsPoint(x, y, rect)
{
    if (x >= rect.left &&
        y >= rect.top &&
        x <= rect.right &&
        y <= rect.bottom)
        return true;
        
    return false;
}
function Vector2D(x, y)
{
    this.x = x || 0;
    this.y = y || 0;
}

Vector2D.prototype.v = function()
{
    var values = [ this.x, this.y ];
    return values;
}

Vector2D.prototype.load = function(x, y)
{
    this.x = x;
    this.y = y;
}

Vector2D.prototype.copy = function(vector)
{
    if (vector)
    {
        this.x = vector.x;
        this.y = vector.y;
    }
}
function Vector3D(x, y, z)
{
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

    this.equals = function(rhs)
    {
        return (this.x == rhs.x &&
                this.y == rhs.y &&
                this.z == rhs.z);
    }
}

Vector3D.prototype.alert = function()
{
    var msg  = "x: " + this.x + "\n";
        msg += "y: " + this.y + "\n";
        msg += "z: " + this.z + "\n";
    alert(msg);
}

Vector3D.prototype.v = function()
{
    var values = [ this.x, this.y, this.z ];
    return values;
}

Vector3D.prototype.load = function(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
}

Vector3D.prototype.copy = function(vector)
{
    if (vector)
    {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
    }
}

Vector3D.prototype.multiplyScalar = function(scalar)
{
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
}

Vector3D.prototype.multiplyVector = function(vector)
{
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
}

Vector3D.prototype.addVector = function(vector)
{
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
}

Vector3D.prototype.subtractVector = function(vector)
{
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
}

Vector3D.prototype.normalize = function()
{
    var mag = magnitude(this.x, this.y, this.z);
    if (mag != 0)
    {
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
    }
}

function dotProduct(v1, v2)
{
    return ((v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z));
}

function crossProduct(v1, v2)
{
    var result = new Vector3D();
    
    result.x = (v1.y * v2.z) - (v1.z * v2.y);
    result.y = (v1.z * v2.x) - (v1.x * v2.z);
    result.z = (v1.x * v2.y) - (v1.y * v2.x);
    
    return result;
}

function cosineAngleBetween(v1, v2)
{
    var mag = magnitude(v1.x, v1.y, v1.z) * magnitude(v2.x, v2.y, v2.z);
    if (mag != 0)
    {
        var cosAngle = dotProduct(v1, v2) / mag;

        // clamp values between -1 and 1
        if (cosAngle > 1) cosAngle = 1;
        else if (cosAngle < -1) cosAngle = -1;

        return cosAngle;
    }

    return 1;
}

function midpoint(v1, v2)
{
    var result = new Vector3D();
    
    result.x = (v1.x + v2.x) / 2;
    result.y = (v1.y + v2.y) / 2;
    result.z = (v1.z + v2.z) / 2;
    
    return result;
}

function distanceBetween(v1, v2)
{
    return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + 
                     (v1.y - v2.y) * (v1.y - v2.y) +
                     (v1.z - v2.z) * (v1.z - v2.z));
}

function subtract3D(v1, v2)
{
    var result = new Vector3D(v1.x, v1.y, v1.z);
    result.subtractVector(v2);
    return result;
}
function Vector4D(x, y, z, w)
{
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
}

Vector4D.prototype.v = function()
{
    var values = [ this.x, this.y, this.z, this.w ];
    return values;
}

Vector4D.prototype.load = function(x, y, z, w)
{
    if (Vector4D)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

Vector4D.prototype.copy = function(vector)
{
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
    this.w = vector.w;
}
function Matrix4x4(_11, _12, _13, _14,
                   _21, _22, _23, _24,
                   _31, _32, _33, _34,
                   _41, _42, _43, _44)
{
    this._11 = _11 || 1;
    this._12 = _12 || 0;
    this._13 = _13 || 0;
    this._14 = _14 || 0;

    this._21 = _21 || 0;
    this._22 = _22 || 1;
    this._23 = _23 || 0;
    this._24 = _24 || 0;

    this._31 = _31 || 0;
    this._32 = _32 || 0;
    this._33 = _33 || 1;
    this._34 = _34 || 0;

    this._41 = _41 || 0;
    this._42 = _42 || 0;
    this._43 = _43 || 0;
    this._44 = _44 || 1;
}

Matrix4x4.prototype.alert = function()
{
    alert([[this._11, this._12, this._13, this._14].join(" "),
           [this._21, this._22, this._23, this._24].join(" "),
           [this._31, this._32, this._33, this._34].join(" "),
           [this._41, this._42, this._43, this._44].join(" ")].join("\n") 
    );
}

Matrix4x4.prototype.flatten = function()
{
    var v = [
        this._11, this._12, this._13, this._14,
        this._21, this._22, this._23, this._24,
        this._31, this._32, this._33, this._34,
        this._41, this._42, this._43, this._44
    ];
    
    return v;
}

Matrix4x4.prototype.getAt = function(row, col)
{
    switch (row)
    {
    case 0:
        {
            switch (col)
            {
            case 0: return this._11;
            case 1: return this._12;
            case 2: return this._13;
            case 3: return this._14;
            }
        }
        break;
     
    case 1:
        {
            switch (col)
            {
            case 0: return this._21;
            case 1: return this._22;
            case 2: return this._23;
            case 3: return this._24;
            }
        }
        break;
        
    case 2:
        {
            switch (col)
            {
            case 0: return this._31;
            case 1: return this._32;
            case 2: return this._33;
            case 3: return this._34;
            }
        }
        break;
        
    case 3:
        {
            switch (col)
            {
            case 0: return this._41;
            case 1: return this._42;
            case 2: return this._43;
            case 3: return this._44;
            }
        }
        break;
    }
}

Matrix4x4.prototype.setAt = function(row, col, value)
{
    switch (row)
    {
    case 0:
        {
            switch (col)
            {
            case 0: this._11 = value; break;
            case 1: this._12 = value; break;
            case 2: this._13 = value; break;
            case 3: this._14 = value; break;
            }
        }
        break;
     
    case 1:
        {
            switch (col)
            {
            case 0: this._21 = value; break;
            case 1: this._22 = value; break;
            case 2: this._23 = value; break;
            case 3: this._24 = value; break;
            }
        }
        break;
        
    case 2:
        {
            switch (col)
            {
            case 0: this._31 = value; break;
            case 1: this._32 = value; break;
            case 2: this._33 = value; break;
            case 3: this._34 = value; break;
            }
        }
        break;
        
    case 3:
        {
            switch (col)
            {
            case 0: this._41 = value; break;
            case 1: this._42 = value; break;
            case 2: this._43 = value; break;
            case 3: this._44 = value; break;
            }
        }
        break;
    }
}

Matrix4x4.prototype.load = function(_11, _12, _13, _14,
                                    _21, _22, _23, _24,
                                    _31, _32, _33, _34,
                                    _41, _42, _43, _44)
{
    this._11 = _11;
    this._12 = _12;
    this._13 = _13;
    this._14 = _14;
    
    this._21 = _21;
    this._22 = _22;
    this._23 = _23;
    this._24 = _24;
    
    this._31 = _31;
    this._32 = _32;
    this._33 = _33;
    this._34 = _34;
    
    this._41 = _41;
    this._42 = _42;
    this._43 = _43;
    this._44 = _44;
}

Matrix4x4.prototype.loadMatrix = function(matrix)
{
    this._11 = matrix._11;
    this._12 = matrix._12;
    this._13 = matrix._13;
    this._14 = matrix._14;
    
    this._21 = matrix._21;
    this._22 = matrix._22;
    this._23 = matrix._23;
    this._24 = matrix._24;
    
    this._31 = matrix._31;
    this._32 = matrix._32;
    this._33 = matrix._33;
    this._34 = matrix._34;
    
    this._41 = matrix._41;
    this._42 = matrix._42;
    this._43 = matrix._43;
    this._44 = matrix._44;
}

Matrix4x4.prototype.loadArray = function(array)
{
    this._11 = array[0];
    this._12 = array[1];
    this._13 = array[2];
    this._14 = array[3];

    this._21 = array[4];
    this._22 = array[5];
    this._23 = array[6];
    this._24 = array[7];

    this._31 = array[8];
    this._32 = array[9];
    this._33 = array[10];
    this._34 = array[11];

    this._41 = array[12];
    this._42 = array[13];
    this._43 = array[14];
    this._44 = array[15];
}

Matrix4x4.prototype.loadIdentity = function()
{
    this._11 = 1;
    this._12 = 0;
    this._13 = 0;
    this._14 = 0;
        
    this._21 = 0;
    this._22 = 1;
    this._23 = 0;
    this._24 = 0;
    
    this._31 = 0;
    this._32 = 0;
    this._33 = 1;
    this._34 = 0;
    
    this._41 = 0;
    this._42 = 0;
    this._43 = 0;
    this._44 = 1;
}

Matrix4x4.prototype.loadTranslation = function(x, y, z)
{
    this.loadIdentity();
    
    this._41 = x;
    this._42 = y;
    this._43 = z;
}

Matrix4x4.prototype.loadRotation = function(x, y, z, degrees)
{
    // build rotation (and inverse rotation) matrix to rotate space 
    // about the X axis so that the rotation axis lies in the XZ plane
    var mX = new Matrix4x4();
    var mXinv = new Matrix4x4();
    var v = Math.sqrt(y * y + z * z);
    if (v != 0)
    {
        var y_v = y / v;
        var z_v = z / v;

        mX._22 =  z_v;
        mX._23 =  y_v;
        mX._32 = -y_v;
        mX._33 =  z_v;

        mXinv._22 =  z_v;
        mXinv._23 = -y_v;
        mXinv._32 =  y_v;
        mXinv._33 =  z_v;
    }

    // build rotation (and inverse rotation) matrix to rotate space 
    // about the Y axis so that the rotation axis is aligned with the Z axis
    var mY = new Matrix4x4();
    var mYinv = new Matrix4x4();
    var v2 = magnitude(x, y, z);
    if (v2 != 0)
    {
        var v_v2 = v / v2;
        var x_v2 = x / v2;

        mY._11 =  v_v2;
        mY._13 =  x_v2;
        mY._31 = -x_v2;
        mY._33 =  v_v2;

        mYinv._11 =  v_v2;
        mYinv._13 = -x_v2;
        mYinv._31 =  x_v2;
        mYinv._33 =  v_v2;
    }

    // build rotation matrix to rotate about the Z axis
    var mZ = new Matrix4x4();
    var cosAngle = Math.cos(toRadians(degrees));
    var sinAngle = Math.sin(toRadians(degrees));
    mZ._11 =  cosAngle;
    mZ._12 =  sinAngle;
    mZ._21 = -sinAngle;
    mZ._22 =  cosAngle;

    // sum rotations
    var result = mX.multiply(mY.multiply(mZ.multiply(mYinv.multiply(mXinv))));
    this.loadMatrix(result);
}

Matrix4x4.prototype.loadXAxisRotation = function(degrees)
{
    this.loadIdentity();

    var cosAngle = Math.cos(toRadians(degrees));
    var sinAngle = Math.sin(toRadians(degrees));

    this._22 =  cosAngle;
    this._23 =  sinAngle;
    this._32 = -sinAngle;
    this._33 =  cosAngle;
}

Matrix4x4.prototype.loadYAxisRotation = function(degrees)
{
    this.loadIdentity();

    var cosAngle = Math.cos(toRadians(degrees));
    var sinAngle = Math.sin(toRadians(degrees));

    this._11 =  cosAngle;
    this._13 = -sinAngle;
    this._31 =  sinAngle;
    this._33 =  cosAngle;
}

Matrix4x4.prototype.loadZAxisRotation = function(degrees)
{
    this.loadIdentity();

    var cosAngle = Math.cos(toRadians(degrees));
    var sinAngle = Math.sin(toRadians(degrees));

    this._11 =  cosAngle;
    this._12 =  sinAngle;
    this._21 = -sinAngle;
    this._22 =  cosAngle;
}

Matrix4x4.prototype.loadXYZAxisRotation = function(degreesX, degreesY, degreesZ)
{
    var mX = new Matrix4x4();
    var mY = new Matrix4x4();
    var mZ = new Matrix4x4();

    mX.loadXAxisRotation(degreesX);
    mY.loadYAxisRotation(degreesY);
    mZ.loadZAxisRotation(degreesZ);

    // sum rotations
    var result = mY.multiply(mX.multiply(mZ));
    this.loadMatrix(result);
}

Matrix4x4.prototype.getRotationAngles = function()
{
    var x, y, z;
    
    x = Math.asin(clamp(this._23, -1, 1));
    var cosx = Math.cos(x);
    
    if (!epsilonEqual(cosx, 0, FLT_EPSILON))
    {
        y = Math.atan2(-(this._13) / cosx, this._33 / cosx);
        z = Math.atan2(-(this._21) / cosx, this._22 / cosx); 
    }
    else // cosx == 0
    {
        // remove x-axis rotation to obtain z-axis rotation by 
        // multiplying this matrix with inverse of x-axis rotation
        var zAxisRot = new Matrix4x4();
        zAxisRot.loadXAxisRotation(toDegrees(x));
        zAxisRot.transpose(); // invert rotation
        zAxisRot.loadMatrix(zAxisRot.multiply(this));
        
        y = 0;
        z = Math.atan2(-(zAxisRot._21), zAxisRot._22);
    }
    
    return { x: toDegrees(x), y: toDegrees(y), z: toDegrees(z) };
}

Matrix4x4.prototype.loadScale = function(x, y, z)
{
    this.loadIdentity();

    this._11 = x;
    this._22 = y;
    this._33 = z;
}

Matrix4x4.prototype.getScalingFactors = function()
{
    var a, b;
    
    // x
    a = this.transform(1, 0, 0, 0);
    b = this.transform(2, 0, 0, 0);
    var scalingX = magnitude(b.x, b.y, b.z) - magnitude(a.x, a.y, a.z);
    
    // y
    a = this.transform(0, 1, 0, 0);
    b = this.transform(0, 2, 0, 0);
    var scalingY = magnitude(b.x, b.y, b.z) - magnitude(a.x, a.y, a.z);
    
    // z
    a = this.transform(0, 0, 1, 0);
    b = this.transform(0, 0, 2, 0);
    var scalingZ = magnitude(b.x, b.y, b.z) - magnitude(a.x, a.y, a.z);
    
    return { x: scalingX, y: scalingY, z: scalingZ };
}

Matrix4x4.prototype.multiply = function(rhs)
{
    var result = new Matrix4x4();
    
    if (!rhs)
    {
        return;    
    }
    
    result.load
    (
        this._11 * rhs._11 + this._12 * rhs._21 + this._13 * rhs._31 + this._14 * rhs._41,
        this._11 * rhs._12 + this._12 * rhs._22 + this._13 * rhs._32 + this._14 * rhs._42,
        this._11 * rhs._13 + this._12 * rhs._23 + this._13 * rhs._33 + this._14 * rhs._43,
        this._11 * rhs._14 + this._12 * rhs._24 + this._13 * rhs._34 + this._14 * rhs._44,
        this._21 * rhs._11 + this._22 * rhs._21 + this._23 * rhs._31 + this._24 * rhs._41,
        this._21 * rhs._12 + this._22 * rhs._22 + this._23 * rhs._32 + this._24 * rhs._42,
        this._21 * rhs._13 + this._22 * rhs._23 + this._23 * rhs._33 + this._24 * rhs._43,
        this._21 * rhs._14 + this._22 * rhs._24 + this._23 * rhs._34 + this._24 * rhs._44,
        this._31 * rhs._11 + this._32 * rhs._21 + this._33 * rhs._31 + this._34 * rhs._41,
        this._31 * rhs._12 + this._32 * rhs._22 + this._33 * rhs._32 + this._34 * rhs._42,
        this._31 * rhs._13 + this._32 * rhs._23 + this._33 * rhs._33 + this._34 * rhs._43,
        this._31 * rhs._14 + this._32 * rhs._24 + this._33 * rhs._34 + this._34 * rhs._44,
        this._41 * rhs._11 + this._42 * rhs._21 + this._43 * rhs._31 + this._44 * rhs._41,
        this._41 * rhs._12 + this._42 * rhs._22 + this._43 * rhs._32 + this._44 * rhs._42,
        this._41 * rhs._13 + this._42 * rhs._23 + this._43 * rhs._33 + this._44 * rhs._43,  
        this._41 * rhs._14 + this._42 * rhs._24 + this._43 * rhs._34 + this._44 * rhs._44
     );
     
     return result; 
}

Matrix4x4.prototype.leftMultiply = function(lhs)
{
    var result = lhs.multiply(this);
    
    return result;
}

Matrix4x4.prototype.transpose = function()
{
    var temp = new Matrix4x4();
    temp.loadMatrix(this);
    
    this._11 = temp._11;
    this._12 = temp._21;
    this._13 = temp._31;
    this._14 = temp._41;

    this._21 = temp._12;
    this._22 = temp._22;
    this._23 = temp._32;
    this._24 = temp._42;

    this._31 = temp._13;
    this._32 = temp._23;
    this._33 = temp._33;
    this._34 = temp._43;

    this._41 = temp._14;
    this._42 = temp._24;
    this._43 = temp._34;
    this._44 = temp._44;
}

Matrix4x4.prototype.invert = function()
{
    var det = determinant4x4(this._11, this._12, this._13, this._14,
                             this._21, this._22, this._23, this._24,
                             this._31, this._32, this._33, this._34,
                             this._41, this._42, this._43, this._44);
    if (det == 0)
    {
        // no inverse
        return;
    }
    
    var inverse  = new Matrix4x4();
    
    var i, j, i2, j2, k;
    
    for (i=0; i < 4; i++)
    {
        for (j=0; j < 4; j++)
        {
            var sub = [];

            for (i2=0, k=0; i2 < 4; i2++)
            {
                if (i2 == i) continue;

                for (j2=0; j2 < 4; j2++)
                {
                    if (j2 == j) continue;

                    sub[k++] = this.getAt(i2, j2);
                }
            }

            inverse.setAt(i, j, determinant3x3(sub[0], sub[1], sub[2], sub[3], sub[4], sub[5], sub[6], sub[7], sub[8]) / det * (i+j & 1 ? -1 : 1));
        }
    }

    // transpose
    inverse.transpose();

    this.loadMatrix(inverse);
}

Matrix4x4.prototype.transform = function(x, y, z, w)
{
    var tx, ty, tz;
    
    if (w == 0)
    {
        tx = this._11 * x + this._21 * y + this._31 * z;
        ty = this._12 * x + this._22 * y + this._32 * z;
        tz = this._13 * x + this._23 * y + this._33 * z;
    }
    else if (w == 1)
    {
        tx = this._11 * x + this._21 * y + this._31 * z + this._41;
        ty = this._12 * x + this._22 * y + this._32 * z + this._42;
        tz = this._13 * x + this._23 * y + this._33 * z + this._43;
    }
    else
    {
        tx = this._11 * x + this._21 * y + this._31 * z + this._41 * w;
        ty = this._12 * x + this._22 * y + this._32 * z + this._42 * w;
        tz = this._13 * x + this._23 * y + this._33 * z + this._43 * w;
    } 
    
    return { x: tx, y: ty, z: tz };
}

Matrix4x4.prototype.transformw = function(x, y, z, w)
{
    var tx, ty, tz, tw;
    
    if (w == 0)
    {
        tx = this._11 * x + this._21 * y + this._31 * z;
        ty = this._12 * x + this._22 * y + this._32 * z;
        tz = this._13 * x + this._23 * y + this._33 * z;
        tw = this._14 * x + this._24 * y + this._34 * z;
    }
    else if (w == 1)
    {
        tx = this._11 * x + this._21 * y + this._31 * z + this._41;
        ty = this._12 * x + this._22 * y + this._32 * z + this._42;
        tz = this._13 * x + this._23 * y + this._33 * z + this._43;
        tw = this._14 * x + this._24 * y + this._34 * z + this._44;
    }
    else
    {
        tx = this._11 * x + this._21 * y + this._31 * z + this._41 * w;
        ty = this._12 * x + this._22 * y + this._32 * z + this._42 * w;
        tz = this._13 * x + this._23 * y + this._33 * z + this._43 * w;
        tw = this._14 * x + this._24 * y + this._34 * z + this._44 * w;
    } 
    
    return { x: tx, y: ty, z: tz, w: tw };
}

Matrix4x4.prototype.transformVector3D = function(vector, w)
{
    return this.transform(vector.x, vector.y, vector.z, w);
}
MatrixStack.prototype = new Stack();
MatrixStack.prototype.constructor = MatrixStack;

function MatrixStack(element)
{
    Stack.call(this, element);
}

MatrixStack.prototype.push = function(element)
{
    if (element)
    {
        this.stack.push(element);
    }
    else
    {
        this.stack.push(this.top());
    }
}

MatrixStack.prototype.loadMatrix = function(matrix)
{
    this.load(matrix);
}

MatrixStack.prototype.leftMultiply = function(lhs)
{
    var result = lhs.multiply(this.top());
    this.pop();
    Stack.prototype.push.call(this, result);
}

MatrixStack.prototype.rightMultiply = function(rhs)
{
    var result = this.top().multiply(rhs);
    this.pop();
    Stack.prototype.push.call(this, result);
}

function Quaternion()
{
    this.w = 1;
    this.x = 0;
    this.y = 0;
    this.z = 0;
}

Quaternion.prototype.load = function(w, x, y, z)
{
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
}

Quaternion.prototype.loadQuaternion = function(quaternion)
{
    this.w = quaternion.w;
    this.x = quaternion.x;
    this.y = quaternion.y;
    this.z = quaternion.z;
}

Quaternion.prototype.loadArray = function(array)
{
    this.w = array[0];
    this.x = array[1];
    this.y = array[2];
    this.z = array[3];
}

Quaternion.prototype.loadIdentity = function()
{
    this.w = 1;
    this.x = 0;
    this.y = 0;
    this.z = 0;
}

Quaternion.prototype.magnitude = function()
{
    return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
}

Quaternion.prototype.normalize = function()
{
    var magnitude = this.magnitude();
    
    this.w /= magnitude;
    this.x /= magnitude;
    this.y /= magnitude;
    this.z /= magnitude; 
}

Quaternion.prototype.loadRotation = function(x, y, z, degrees)
{
    var radians = toRadians(degrees) / 2;
    
    var sinAngle = Math.sin(radians);
    var cosAngle = Math.cos(radians);
    
    this.w = cosAngle;
    this.x = x * sinAngle;
    this.y = y * sinAngle;
    this.z = z * sinAngle;
    
    this.normalize();
}

Quaternion.prototype.loadXAxisRotation = function(degrees)
{
    var radians = toRadians(degrees) / 2;
    
    this.w = Math.cos(radians);
    this.x = Math.sin(radians);
    this.y = 0;
    this.z = 0;
}

Quaternion.prototype.loadYAxisRotation = function(degrees)
{
    var radians = toRadians(degrees) / 2;
    
    this.w = Math.cos(radians);
    this.x = 0
    this.y = Math.sin(radians);;
    this.z = 0;
}

Quaternion.prototype.loadZAxisRotation = function(degrees)
{
    var radians = toRadians(degrees) / 2;
    
    this.w = Math.cos(radians);
    this.x = 0;
    this.y = 0;
    this.z = Math.sin(radians);
}

Quaternion.prototype.loadXYZAxisRotation = function(degreesX, degreesY, degreesZ)
{
    var radiansX = toRadians(degreesX) / 2;
    var radiansY = toRadians(degreesY) / 2;
    var radiansZ = toRadians(degreesZ) / 2;
    
    var qX = new Quaternion();
    qX.load(Math.cos(radiansX), Math.sin(radiansX), 0, 0);
    
    var qY = new Quaternion();
    qY.load(Math.cos(radiansY), 0, Math.sin(radiansY), 0);
    
    var qZ = new Quaternion();
    qZ.load(Math.cos(radiansZ), 0, 0, Math.sin(radiansZ));
    
    // sum rotations
    var result = qY.multiply(qX.multiply(qZ));
    this.loadQuaternion(result);
}

Quaternion.prototype.multiply = function(rhs)
{
    var result = new Quaternion();
    
    result.load
    (
        this.w * rhs.w - this.x * rhs.x - this.y * rhs.y - this.z * rhs.z,
        this.w * rhs.x + this.x * rhs.w + this.y * rhs.z - this.z * rhs.y,
        this.w * rhs.y + this.y * rhs.w + this.z * rhs.x - this.x * rhs.z,
        this.w * rhs.z + this.z * rhs.w + this.x * rhs.y - this.y * rhs.x    
    );
    
    return result;
}

Quaternion.prototype.getMatrix = function()
{
    var matrix = new Matrix4x4();
    
    var x2 = this.x + this.x;
    var y2 = this.y + this.y;
    var z2 = this.z + this.z;
    var xx = this.x * x2;
    var xy = this.x * y2;
    var xz = this.x * z2;
    var yy = this.y * y2;
    var yz = this.y * z2;
    var zz = this.z * z2;
    var wx = this.w * x2;
    var wy = this.w * y2;
    var wz = this.w * z2;

    matrix._11 = 1 - (yy + zz);
    matrix._21 = xy - wz;
    matrix._31 = xz + wy;
    matrix._41 = 0;

    matrix._12 = xy + wz;
    matrix._22 = 1 - (xx + zz);
    matrix._32 = yz - wx;
    matrix._42 = 0;

    matrix._13 = xz - wy;
    matrix._23 = yz + wx;
    matrix._33 = 1 - (xx + yy);
    matrix._43 = 0;

    matrix._14 = 0;
    matrix._24 = 0;
    matrix._34 = 0;
    matrix._44 = 1;
    
    return matrix;
}

function Line(point, dir)
{
    this.point = new Vector3D(point.x, point.y, point.z);
    this.dir = new Vector3D(dir.x, dir.y, dir.z);
}
function Plane(point, normal)
{
    this.point = new Vector3D();
    this.normal = new Vector3D();
    this.dot = 0;
    
    if (point && normal)
    {
        this.point.copy(point);
        this.normal.copy(normal);
        this.dot = dotProduct(this.point, this.normal);
    }
}

Plane2.prototype = new Plane();
Plane2.prototype.constructor = Plane2;

function Plane2(v0, v1, v2)
{
    var normal;

    if (v0 && v1 && v2)
    {
        var leg1 = new Vector3D(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
        var leg2 = new Vector3D(v0.x - v1.x, v0.y - v1.y, v0.z - v1.z);
        normal = crossProduct(leg1, leg2);
        normal.normalize();
    }
    
    Plane.call(this, v0, normal);
}

/**
 * Determine if a point lies on the plane.
 * @param point     - the point.
 * @param plane     - the plane.
 * @param tolerance - tolerance amount.
 * @return bool     - true if the point lies on the plane, false if it does not.
 */
function pointOnPlane(point, plane, tolerance)
{
    return (Math.abs(dotProduct(point, plane.normal) - plane.dot) < tolerance ? true : false);
}

/**
 * Determine if a point lies on the positive side of the plane; i.e., determine if the 
 * point lies in the half-space on the side of the plane in the direction of the normal.
 * @param point     - the point.
 * @param plane     - the plane.
 * @return bool     - true if the point lies on the positive side of the plane, false if 
 *                    it does not.
 */
function pointOnPositiveSideOfPlane(point, plane)
{
    return (dotProduct(point, plane.normal) - plane.dot > 0 ? true : false);
}

/**
 * Determine if a point lies on the negative side of the plane; i.e., determine if the 
 * point lies in the half-space on the side of the plane in the opposite direction of the 
 * normal.
 * @param point     - the point.
 * @param plane     - the plane.
 * @return bool     - true if the point lies on the negative side of the plane, false if 
 *                    it does not.
 */
function pointOnNegativeSideOfPlane(point, plane)
{
    return (dotProduct(point, plane.normal) - plane.dot < 0 ? true : false);
}

/**
 * Determine if a line intersects the plane.  If it does, find the point of intersection.
 * @param line  - the line.
 * @param plane - the plane.
 * @param point - the point of intersection (if line intersects plane).
 * @return int  - returns:
 *                  0 if line does not intersect plane
 *                  1 if line intersects plane at one point
 *                  2 if line intersects plane at infinite points (line lies on plane)
 */
function lineIntersectsPlane(line, plane)
{
    var point = new Vector3D();
    var result;
    
    // solve for t in terms of plane equation Ax + By + Cz = D
    var lhs = plane.normal.x * line.dir.x + plane.normal.y * line.dir.y + plane.normal.z * line.dir.z;
    if (lhs == 0)  // plane and line are parallel
    {
        // if line point lies on the plane, consider this an intersection
        if (pointOnPlane(line.point, plane, FLT_EPSILON))
        {
            point.copy(line.point);
            result = 2;
        }

        result = 0;
    }
    else
    {
        var rhs = plane.dot - (plane.normal.x * line.point.x + plane.normal.y * line.point.y + plane.normal.z * line.point.z);
        var t = rhs / lhs;

        // calculate point of intersection
        point.x = t * line.dir.x + line.point.x;
        point.y = t * line.dir.y + line.point.y;
        point.z = t * line.dir.z + line.point.z;

        result = 1;
    }

    return { result: result, point: point };
}

/**
 * Determine if a line segment intersects the plane.  If it does, find the point of intersection.
 * @param a      - one endpoint of the line segment.
 * @param b      - other endpoint of the line segment.
 * @param plane  - the plane.
 * @return point - the point of intersection (if line segment intersects plane).
 * @return count - returns:
 *                  0 if line segment does not intersect plane
 *                  1 if line segment intersects plane at one point
 *                  2 if line segment intersects plane at infinite points (line segment lies on plane)
 */
function lineSegmentPlaneIntersection(a, b, plane)
{
    // represent line segment in parametric line equation form;
    // line through P0(x0, y0, z0) parallel to v = Ai + Bj + Ck =>
    // x = x0 + tA, y = y0 + tB, z = z0 + tC
    var ab = new Vector3D(b.x - a.x, b.y - a.y, b.z - a.z);
    var x0 = a.x;
    var y0 = a.y;
    var z0 = a.z;
    var tA = ab.x;
    var tB = ab.y;
    var tC = ab.z;

    // solve for t in terms of plane equation Ax + By + Cz = D
    var lhs = plane.normal.x * tA + plane.normal.y * tB + plane.normal.z * tC;
    if (lhs == 0)  // plane and line segment are parallel
    {
        // if a lies on the plane, consider this an intersection
        if (pointOnPlane(a, plane, FLT_EPSILON))
        {
            var point = new Vector3D(a);
            return { count: 2, point: point };
        }

        return { count: 0 };
    }

    var rhs = plane.dot - (plane.normal.x * x0 + plane.normal.y * y0 + plane.normal.z * z0);
    var t = rhs / lhs;

    // if t is not in range [0, 1], then point of intersection is not
    // within line segment
    if (t < 0 || t > 1) 
    {
        return { count: 0 };
    }

    // point of intersection is within line segment; calculate point
    var point = new Vector3D();
    point.x = t * tA + x0;
    point.y = t * tB + y0;
    point.z = t * tC + z0;

    return { count: 1, point: point };
}

/**
 * Determine if planes are coplanar.
 * @param plane1 - the first plane.
 * @param plane2 - the second plane.
 * @return bool  - true if the planes are coplanar, false if they are not.
 */
function coplanar(plane1, plane2)
{
    return (((plane1.normal == plane2.normal || plane1.normal == -plane2.normal) &&
              pointOnPlane(plane1.point, plane2)) ? true: false);
}

/**
 * Determine if planes intersect.
 * @param plane1 - the first plane.
 * @param plane2 - the second plane.
 * @return bool  - true if the planes intersect, false if they do not.
 */
function planesIntersect(plane1, plane2)
{
    // if planes are parallel (normal cross product == 0),
    // planes don't intersect (or they are coplanar)
    var zero = new Vector3D(0, 0, 0);
    if (crossProduct(plane1.normal, plane2.normal).equals(zero))
    {
        return false;
    }
 
    return true;
}

/**
 * Determine the distance between 2 parallel planes.  If planes are not parallel, 0 is returned.
 * @param plane1 - the first plane.
 * @param plane2 - the second plane.
 * @return float - the distance between the planes.
 */
function distanceBetweenPlanes(plane1, plane2)
{
    if (coplanar(plane1, plane2))
    {
        return 0;
    }

    if (!planesIntersect(plane1, plane2))
    {
        var intersection = lineIntersectsPlane(new Line(plane1.point, plane1.normal), plane2);
        if (intersection.result)
        {
            return distanceBetween(plane1.point, point);
        }
        else
        {
            return 0;
        }
    }

    // planes intersect
    return 0;
}
function ViewVolume()
{
    this.left = null;
    this.right = null;
    this.top = null;
    this.bottom = null;
    this.near = null;
    this.far = null;
}

ViewVolume.prototype.setPerspective = function(fovyRadians, aspectRatio, near, far)
{
    // calculate the front and back frustum plane quadrilateral endpoints
    // for a symmetric frustum volume

    // front quad
   
    // derive 1/2 quad height from y-FOV and distance from origin
    var height = near * Math.tan(0.5 * fovyRadians);

    // derive 1/2 quad width from aspect ratio
    var width = height * aspectRatio;

    // set front quad endpoints
    var frontTopLeft  = new Vector3D(-width, height, near);
    var frontTopRight = new Vector3D( width, height, near);
    var frontBotLeft  = new Vector3D(-width,-height, near);
    var frontBotRight = new Vector3D( width,-height, near);

    // back quad
    height = far * Math.tan(0.5 * fovyRadians);
    width = height * aspectRatio;

    var backTopLeft  = new Vector3D(-width, height, far);
    var backTopRight = new Vector3D( width, height, far);
    var backBotLeft  = new Vector3D(-width,-height, far);
    var backBotRight = new Vector3D( width,-height, far);

    // derive planes from frustum endpoints (specify points in 
    // clockwise order so that plane normals point out of frustum)
    this.left   = new Plane2(frontTopLeft, frontBotLeft, backBotLeft);
    this.right  = new Plane2(frontBotRight, frontTopRight, backTopRight);
    this.top    = new Plane2(frontTopLeft,  backTopLeft,   backTopRight);
    this.bottom = new Plane2(frontBotLeft, frontBotRight, backBotRight);
    this.near   = new Plane2(frontBotLeft,  frontTopLeft,  frontTopRight);
    this.far    = new Plane2(backBotRight,  backTopRight,  backTopLeft);
}

ViewVolume.prototype.setOrthographic = function(left, right, top, bottom, near, far)
{
    // calculate the front and back frustum plane quadrilateral endpoints
    // for a symmetric frustum volume

    // set front quad endpoints
    var frontTopLeft  = new Vector3D(left,  top,    near);
    var frontTopRight = new Vector3D(right, top,    near);
    var frontBotLeft  = new Vector3D(left,  bottom, near);
    var frontBotRight = new Vector3D(right, bottom, near);

    // back quad
    var backTopLeft   = new Vector3D(left,  top,    far);
    var backTopRight  = new Vector3D(right, top,    far);
    var backBotLeft   = new Vector3D(left,  bottom, far);
    var backBotRight  = new Vector3D(right, bottom, far);

    // derive planes from frustum endpoints (specify points in 
    // clockwise order so that plane normals point out of frustum)
    this.left   = new Plane2(backBotLeft,   backTopLeft,   frontTopLeft);
    this.right  = new Plane2(frontBotRight, frontTopRight, backTopRight);
    this.top    = new Plane2(frontTopLeft,  backTopLeft,   backTopRight);
    this.bottom = new Plane2(backBotRight,  backBotLeft,   frontBotLeft);
    this.near   = new Plane2(frontBotLeft,  frontTopLeft,  frontTopRight);
    this.far    = new Plane2(backBotRight,  backTopRight,  backTopLeft);
}
var EPSILON = 0.00000001;

function SIGN3(v) 
{
    (((v).x < 0 ) ? 4 : 0 | ((v).y < 0) ? 2 : 0 | ((v).z < 0) ? 1 : 0);
}

/**
 * Solve quadratic equation with term coefficients a (2nd degree term), 
 * b (1st degree term), and c (constant term); return number of real roots; 
 * if 1 root exists, it is set to root1, if 2 roots exist, they are set to 
 * root1 and root2.
 * @param a      - 2nd degree term coefficient.
 * @param b      - 1st degree term coefficient.
 * @param c      - constant term.
 * @return root1 - first real root.
 * @return root2 - second real root.
 * @return count - 0: no real roots exist
 *                 1: 1 real root exists
 *                 2: 2 real roots exist
 */
function solveQuadraticEquation(a, b, c)
{
   if (a == 0) 
   {
       return { count: 0 };
   }

   var sqrt_term = b * b - 4 * a * c;
   if (sqrt_term < 0) 
   {
       return { count: 0 };
   }

   if (sqrt_term == 0)
   {
      var root1 = -b / (2 * a);
      return { count: 1, root1: root1 };
   }

   sqrt_term = Math.sqrt(sqrt_term);

   var root1 = (-b + sqrt_term) / (2 * a);
   var root2 = (-b - sqrt_term) / (2 * a);

   return { count: 2, root1: root1, root2: root2 };
}

/** 
 * Determine if a ray intersects a triangle. 
 *
 * Given a ray defined by an origin and a direction, and a triangle,
 * determine if the ray intersects the triangle; if an intersection exists, 
 * determine the distance t from the ray origin to the point of intersection, and the 
 * barycentric coordinates (u, v) inside the triangle;
 *
 * Algorithm adapted from:
 *    Tomas Moller and Ben Trumbore, "Fast, Minimum Storage Ray/Triangle 
 *    Intersection", journal of graphics tool, vol. 2, no. 1, pp. 21-28, 1997.
 *    http://www.ce.chalmers.se/staff/tomasm
 *
 * @param rayOrig    - ray origination point.
 * @param rayDir     - ray direction.
 * @param v0         - first triangle vertex.
 * @param v1         - second triangle vertex.
 * @param v2         - third triangle vertex.
 * @param skipPosDet - if true, skip intersection test (return false) if the triangle's determinate 
 *                     is positive.
 * @param skipNegDet - if true, skip intersection test (return false) if the triangle's determinate 
 *                     is negative.
 * @return t         - distance from ray origin to intersection point (if ray intersects triangle).
 * @return u         - barycentric coordinate u of intersection point (if ray intersects triangle).
 * @return v         - barycentric coordinate v of intersection point (if ray intersects triangle).
 * @return result    - true if the ray intersects the triangle, false if not.
 */
function rayTriangleIntersection(rayOrig, rayDir, v0, v1, v2, skipPosDet, skipNegDet)
{
    // normalize ray direction vector
    var dir = new Vector3D(rayDir.x, rayDir.y, rayDir.z);
    dir.normalize();

    // find vectors for two edges sharing v0
    var edge1 = new Vector3D(v1.x - v0.x, v1.y - v0.y, v1.z - v0.z);
    var edge2 = new Vector3D(v2.x - v0.x, v2.y - v0.y, v2.z - v0.z);
   
    // calculate determinant
    var pvec = crossProduct(dir, edge2);
    var det = dotProduct(edge1, pvec);

    // if determinant is near zero, ray lies in plane of triangle
    if (-EPSILON < det && det < EPSILON) 
    {
        return { result: false };
    }

    // if requested, skip triangles with negative/positive determinates
    if (skipPosDet && det > 0) 
    {
        return { result: false };
    }
    if (skipNegDet && det < 0) 
    {
        return { result: false };
    }

    var inv_det = 1 / det;

    // calculate distance from v0 to ray origin
    var tvec = new Vector3D(rayOrig.x - v0.x, rayOrig.y - v0.y, rayOrig.z - v0.z);

    // calculate u parameter and test bounds
    var u = dotProduct(tvec, pvec) * inv_det;
    if (u < 0 || u > 1)
    {
        return { result: false };
    }

    var qvec = crossProduct(tvec, edge1);

    // calculate v parameter and test bounds
    var v = dotProduct(dir, qvec) * inv_det;
    if (v < 0 || u + v > 1) 
    {
        return { result: false };
    }

    // ray intersects triangle, calculate t
    var t = dotProduct(edge2, qvec) * inv_det;

    return { result: true, t: t, u: u, v: v };
}

/**
 * Determine if a ray intersects a sphere.
 *
 * Given a ray defined by an origination point (x0, y0, z0), and
 * destination point (x1, y1, z1), and represented by the parametric equations: 
 * x = x0 + t(x1 - x0), y = y0 + t(y1 - y0), z = z0 + t(z1 - z0),
 * determine if the ray intersects the sphere defined by center (a, b, c) and
 * radius r, and represented by the equation (x - a)² + (y - b)² + (z - c)² = r²;
 *
 * For convenience, define dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
 *
 * The intersection is found by substituting x, y, and z from the ray equations
 * into the sphere equation, and solving for t (after term collection):
 * 
 * (dx² + dy² + dz²)t² + 2[dx(x0 - a) + dy(y0 - b) + dz(z0 - c)]t
 *    + (x0 - a)² + (y0 - b)² + (z0 - c)² - r² = 0
 *
 * Algorithm adapted from:
 *    Computer Graphics: Principles and Practice, 2nd Edition, Foley, et al., pp. 702-703
 *
 * @param rayOrig - ray origination point.
 * @param rayDir  - ray direction.
 * @param center  - sphere center point.
 * @param radius  - sphere radius.
 * @return root1  - root 1 from solving quadratic equation (if ray intersects sphere).
 * @return root2  - root 2 from solving quadratic equation (if ray intersects sphere).
 * @return count  - 0: ray does not intersect sphere
 *                  1: ray grazes sphere - root1 will contain the one real root
 *                  2: ray intersects sphere - root1 and root2 will contain both real roots
 */
function raySphereIntersection(rayOrig, rayDir, center, radius)
{
    // normalize ray direction vector
    var dir = new Vector3D(rayDir.x, rayDir.y, rayDir.z);
    dir.normalize();
    
    var rayDest = new Vector3D(rayOrig.x + dir.x, rayOrig.y + dir.y, rayOrig.z + dir.z);

    var dx = rayDest.x - rayOrig.x;
    var dy = rayDest.y - rayOrig.y;
    var dz = rayDest.z - rayOrig.z;

    // a = dx * dx + dy * dy + dz * dz == 1
    // because distance from rayOrig to rayDest is 1

    var b = 2 * (dx * (rayOrig.x - center.x) + 
                 dy * (rayOrig.y - center.y) + 
                 dz * (rayOrig.z - center.z));

    var c = (rayOrig.x - center.x) * (rayOrig.x - center.x) +
            (rayOrig.y - center.y) * (rayOrig.x - center.y) +
            (rayOrig.z - center.z) * (rayOrig.z - center.z) -
            radius * radius;

    return solveQuadraticEquation(1, b, c);
}

/**
 * Determine if the triangle contains a point which is known to lie in the plane of the triangle.  
 * Adapted from "Triangle-Cube Intersection", Graphics Gems III, pp.236-239.
 * @param v0      - first triangle vertex.
 * @param v1      - second triangle vertex.
 * @param v2      - third triangle vertex.
 * @param point   - the point.
 * @return result - true if the triangle contains the point, false if not. 
 */
function triangleContainsPoint(v0, v1, v2, point)
{
    // for each triangle side, make a vector out of it by subtracting vertices; 
    // make another vector from one vertex to the point; the cross-product of these 
    // two vectors is orthogonal to both and the signs of its components indicate 
    // whether the point was on the inside or on the outside of this triangle side
    var sign12 = SIGN3(crossProduct(subtract3D(v0, v1), subtract3D(v0, point))); 
    var sign23 = SIGN3(crossProduct(subtract3D(v1, v2), subtract3D(v1, point))); 
    var sign31 = SIGN3(crossProduct(subtract3D(v2, v0), subtract3D(v2, point))); 

    // if all three cross-product vectors agree in their component signs,
    // then the point must be inside all three; the point cannot be outside all 
    // three sides simultaneously.
    if ((sign12 == sign23) && (sign23 == sign31))
    {
        return true;
    }

    return false;
}

/**
 * Determine if a triangle lies on the positive side of the plane (the side in the direction of
 * the plane normal).
 * @param v0    - first vertex of triangle.
 * @param v1    - second vertex of triangle.
 * @param v2    - third vertex of triangle.
 * @return bool - true if the triangle lies on the positive side of the plane, false if not.
 */
function triangleOnPositiveSideOfPlane(v0, v1, v2, plane)
{
    return pointOnPositiveSideOfPlane(v0, plane) &&
           pointOnPositiveSideOfPlane(v1, plane) &&
           pointOnPositiveSideOfPlane(v2, plane);
}

/**
 * Determine if the line segment intersects the triangle.  If so, find the point
 * of intersection.
 * @param a       - one endpoint of the line segment.
 * @param b       - other endpoint of the line segment.
 * @param v0      - first triangle vertex. 
 * @param v1      - second triangle vertex.
 * @param v2      - third triangle vertex.
 * @return point  - the point of intersection (if line segment intersects triangle). 
 * @return result - true if the line segment intersects the triangle, false if not.
 */
function lineSegmentTriangleIntersection(a, b, v0, v1, v2)
{
    // first check that line segment intersects plane of triangle
    var result = lineSegmentPlaneIntersection(a, b, new Plane2(v0, v1, v2));
    if (result.count == 0)
    {
        return { result: false };
    }

    // check that point is within triangle bounding box
    if (result.point.x < min3(v0.x, v1.x, v2.x) ||
        result.point.y < min3(v0.y, v1.y, v2.y) ||
        result.point.z < min3(v0.z, v1.z, v2.z) ||
        result.point.x > max3(v0.x, v1.x, v2.x) ||
        result.point.y > max3(v0.y, v1.y, v2.y) ||
        result.point.z > max3(v0.z, v1.z, v2.z))
    {
        return { result: false };
    }

    // check that point is within triangle
    if (triangleContainsPoint(v0, v1, v2, result.point))
    {
        return { result: true, point: result.point };
    }
    
    return { result: false };
}
var eAttrType = {
    Unknown                     :-1,
    
    Attribute                   :0,
    
    AttributeContainer          :1,
    
    AttributeVector             :2,
    
    AttributeFactory            :3,
    
    AttributeRegistry           :4,
    
    BalloonTipLabelStyleAttr    :5,
    BBoxAttr                    :6,
    BooleanAttr                 :7,
    ColorAttr                   :8,
    FontStyleAttr               :9,
    IconStyleAttr               :10,
    ImageAttr                   :11,
    KeyframeAttr                :12,
    KeyframesAttr               :13,
    LabelStyleAttr              :14,
    HTMLLabelStyleAttr          :15,
    NumberArrayAttr             :16,
    NumberAttr                  :17,
    Matrix4x4Attr               :18,
    PlaneAttr                   :19,
    PulseAttr                   :20,
    RectAttr                    :21,
    ReferenceAttr               :22,
    StringAttr                  :23,
    StyleAttr                   :24,
    StylesAttr                  :25,
    StyleMapAttr                :26,
    StylesMapAttr               :27,
    Vector3DAttr                :28,
    ViewportAttr                :29,
    ViewVolumeAttr              :30,
    
    Node                        :31,
    
    ParentableMotionElement     :32,
    Camera                      :33,
    PerspectiveCamera           :34,
    OrthographicCamera          :35,
    Light                       :36,
    DirectionalLight            :37,
    PointLight                  :38,
    SpotLight                   :39, 
    GlobalIllumination          :40,           
    
    Material                    :41,
    Texture                     :42,
    
    RenderableElement           :43,
    Geometry                    :44,
    VertexGeoemtry              :45,
    TriList                     :46,
    
    Group                       :47,
    Isolator                    :48,
    
    Dissolve                    :49,
    
    Transform                   :50,
    
    QuaternionRotate            :51,
    Scale                       :52,
    Rotate                      :53,
    Translate                   :54,
    
    Model                       :55,
    Surface                     :56,
    MediaTexture                :57,
    NullObject                  :58,
    
    Label                       :59,
    HTMLLabel                   :60,
    BalloonTipLabel             :61,
    
    PathTrace                   :62,
    
    Directive                   :63,
    UpdateDirective             :64,
    RenderDirective             :65,
    RayPickDirective            :66,
    BBoxDirective               :67,
    SerializeDirective          :68,
    
    Evaluator                   :1000,
    SceneInspector              :1001,
    KeyframeInterpolator        :1002,
    BBoxLocator                 :1003,
    ArcballInspector            :1004,
    MapProjectionCalculator     :1005,
    ObjectInspector             :1006,
    
    Evaluator_End               :1999, // all evaluator types must be given a type between Evaluator and Evaluator_End

    Command                     :2000,
    CommandSequence             :2001,
    AppendNode                  :2002,
    AttributeTrigger            :2003,
    AutoInterpolate             :2004,
    Locate                      :2005,
    Play                        :2006,
    Remove                      :2007,
    Serialize                   :2008,
    Set                         :2009,
    Stop                        :2010,
    Command_End                 :2999,

    UserDefined                 :3000
};

var eAttrElemType = {
    // unknown
    eAttrElemType_Unknown               :0,	///

    // standard C-types
    eAttrElemType_Int                   :1,							///
    eAttrElemType_UnsignedInt           :2,					///
    eAttrElemType_Char                  :3,							///
    eAttrElemType_UnsignedChar          :4,					///
    eAttrElemType_Float                 :5,						///
    eAttrElemType_Double                :6,						///

    // attribute
    eAttrElemType_Attribute             :7,					///

    // user-defined
    eAttrElemType_UserDefined           :0x000000FF,		///
    
    // force enumeration to 32-bits
    eAttrElemType_FORCE_DWORD           :0x7FFFFFFF		///
};

function enumerateAttributeTypes()
{
    var count = 0; 
    for (var i in eAttrType)
    {
        if (eAttrType[i] == 0)
            eAttrType[i] = count++;
    }
}

function enumerateAttributeElementTypes()
{
    var count = 0;
    for (var i in eAttrElemType)
    {
        if (eAttrElemType[i] == 0)
            eAttrElemType[i] = count++;
    }
}
var eAttrSetOp = {
    Replace         :0,  
    Add				:1,
    Subtract		:2,
    Multiply		:3,
    Divide			:4,
	Append			:5,
    AND				:6,
    OR				:7,
    XOR             :8,
    NAND			:9,
    NOR				:10
};

function AttributeTargetDesc(target, 
                             sourceElementIndex, 
                             targetElementIndex,
                             op,
                             converter)
{
    this.target = target || null;
    this.sourceElementIndex = sourceElementIndex || -1;
    this.targetElementIndex = targetElementIndex || -1;
    this.op = op || eAttrSetOp.Replace;
    this.converter = converter || null;
}

function AttributeSourceDesc(source,
                             sourceElementIndex,
                             targetElementIndex,
                             op,
                             converter)
{
    this.source = source || null;
    this.sourceElementIndex = sourceElementIndex || -1;
    this.targetElementIndex = targetElementIndex || -1;
    this.op = op || eAttrSetOp.Replace;
    this.converter = converter || null;
}

function AttributeGetParams(elementIndex,
                            valueElementIndex)
{
    this.elementIndex = elementIndex;
    this.valueElementIndex = valueElementIndex;
}

function AttributeSetParams(elementIndex,
                            valueElementIndex,
                            op,
                            updateTargets,
                            alertModifiedCBs)
{
    this.elementIndex = elementIndex || -1;
    this.valueElementIndex = valueElementIndex || -1;
    this.op = op || eAttrSetOp.Replace;
    this.updateTargets = updateTargets != undefined ? updateTargets : true;
    this.alertModifiedCBs = alertModifiedCBs != undefined ? alertModifiedCBs : true;
}
                            
Attribute.prototype = new Base();
Attribute.prototype.constructor = Attribute;

function Attribute() 
{
    Base.call(this);
    this.className = "Attribute";
    this.attrType = eAttrType.Attribute;
    this.attrElemType = eAttrElemType.eAttrElemType_Attribute;
    
    this.values = [];
    this.modifiedCBs = [];
    this.modifiedCBsData = [];
    this.targets = [];
    this.sources = [];
    this.container = null;
    this.registry = null;
}

Attribute.prototype.destroy = function()
{
    // remove all targeting associated with this
    this.removeAllSources();
    this.removeAllTargets();
    
    // call base-class implementation
    Base.prototype.destroy.call(this);
}

Attribute.prototype.clone = function()
{
    return null;
}

Attribute.prototype.getValue = function(values, params)
{
    var elementIndex = (params ? params.elementIndex : -1);
    
    if (elementIndex < 0)
    {
        if (this.values == null)
        {
            values[0] = null;
        }
        else if (this.values.length == undefined)
        {
            values[0] = this.values;
        }
        else // this.values.length > 0
        {
            for (var i=0; i < this.values.length; i++)
            {
                values[i] = this.values[i];
            }
        }
    }
    else // elementIndex >= 0
    {
        var valueElementIndex = Math.max(0, params ? params.valueElementIndex : 0);
            
        values[valueElementIndex] = this.values[elementIndex];
    }
}

Attribute.prototype.setValue = function(values, params)
{
    var elementIndex = (params ? params.elementIndex : -1);
    var op = (params ? params.op : eAttrSetOp.Replace);

    if (elementIndex < 0)
    {
        if (values == null)
        {
            this.values[0] = null;
        }
        else if (values.length == undefined)
        {
            switch (op)
            {
                case eAttrSetOp.Add: this.values[0] += values; break;
                case eAttrSetOp.Replace: this.values[0] = values; break;
                case eAttrSetOp.AND: this.values[0] &= values; break;
                default: alert("unsupported operation passed to Attribute::setValue"); break; // TODO: add support
            }
        }
        else // values.length > 0
        {
            for (var i = 0; i < values.length; i++)
            {
                switch (op)
                {
                    case eAttrSetOp.Add: this.values[i] += values[i]; break;
                    case eAttrSetOp.Replace: this.values[i] = values[i]; break;
                    case eAttrSetOp.AND: this.values[i] &= values[i]; break;
                    default: alert("unsupported operation passed to Attribute::setValue"); break; // TODO: add support
                }
            }
        }
    }
    else // elementIndex >= 0
    {
        if (values == null)
        {
            this.values[elementIndex] = null;
        }
        else if (values.length == undefined)
        {
            this.values[elementIndex] = values;
        }
        else // values.length > 0
        {
            var valueElementIndex = Math.max(0, params ? params.valueElementIndex : 0);
            this.values[elementIndex] = values[valueElementIndex];
        }
    }

    // alert modified CBs
    var alertModifiedCBs = (params ? params.alertModifiedCBs : true);
    if (alertModifiedCBs)
    {
        for (var i = 0; i < this.modifiedCBs.length; i++)
        {
            this.modifiedCBs[i](this, this.modifiedCBsData[i]);
        }
    }

    // update targets
    var updateTargets = (params ? params.updateTargets : true);
    if (updateTargets)
    {
        for (var i = 0; i < this.targets.length; i++)
        {
            var targetDesc = this.targets[i];
            var params = new AttributeSetParams(targetDesc.targetElementIndex, targetDesc.sourceElementIndex,
                                                targetDesc.op, true, true);
            targetDesc.target.setValue(this.values, params);
        }
    }
}

Attribute.prototype.getElement = function(index)
{
    if (this.values.length > index)
    {
        return this.values[index];
    }

    return undefined;
}

Attribute.prototype.setElement = function(index, value, op, updateTargets)
{
    console.debug("TODO: " + arguments.callee.name);
}

Attribute.prototype.getLength = function()
{
    if (this.values.length == undefined)
    {
        return (this.values == undefined ? 0 : 1);
    }   
    
    return this.values.length; 
}

Attribute.prototype.setLength = function(length)
{
    this.values.length = length;
}

Attribute.prototype.addModifiedCB = function(callback, data)
{
    this.modifiedCBs.push(callback);
    this.modifiedCBsData.push(data);
}

Attribute.prototype.removeModifiedCB = function(callback, data)
{   
    this.modifiedCBs.splice(this.modifiedCBs.indexOf(callback), 1);
    this.modifiedCBsData.splice(this.modifiedCBsData.indexOf(data), 1);
}

Attribute.prototype.addTarget = function(target, op, converter, setValueOnTargeting)
{
    if (op == undefined) op = eAttrSetOp.Replace;
    if (converter == undefined) converter = null;
    if (setValueOnTargeting == undefined) setValueOnTargeting = true;
    
    this.addElementTarget(target, -1, -1, op, converter, setValueOnTargeting);
}

Attribute.prototype.addSource = function(source, op, converter, setValueOnTargeting)
{
    source.addTarget(this, op, converter, setValueOnTargeting);
}

Attribute.prototype.removeTarget = function(target)
{
    this.removeElementTarget(target, -1, -1);
}

Attribute.prototype.removeSource = function(source)
{
    source.removeTarget(this);
}

Attribute.prototype.removeAllTargets = function()
{
    while (this.targets.length > 0)
    {
        this.removeElementTarget(this.targets[0].target,
                                 this.targets[0].sourceElementIndex,
                                 this.targets[0].targetElementIndex);
    }
}

Attribute.prototype.removeAllSources = function()
{
    while (this.sources.length > 0)
    {
        this.sources[0].source.removeElementTarget(this,
                                                   this.sources[0].sourceElementIndex,
                                                   this.sources[0].targetElementIndex);
    }
}

Attribute.prototype.addElementTarget = function(target, sourceElementIndex, targetElementIndex, op, converter, setValueOnTargeting)
{
    if (target)
    {
        if (sourceElementIndex == undefined) sourceElementIndex = -1;
        if (targetElementIndex == undefined) targetElementIndex = -1;
        if (op == undefined) op = eAttrSetOp.Replace;
        if (converter == undefined) converter = null;
        if (setValueOnTargeting == undefined) setValueOnTargeting = true;

        this.createTarget(new AttributeTargetDesc(target, sourceElementIndex, targetElementIndex, op, converter));

        // set this as a source of target
        target.createSource(new AttributeSourceDesc(this, sourceElementIndex, targetElementIndex, op, converter));

        if (setValueOnTargeting)
        {
            var params = new AttributeSetParams(targetElementIndex, sourceElementIndex, op, true, true);
            target.setValue(this.values, params);
        }
    }
}

Attribute.prototype.addElementSource = function(source, sourceElementIndex, targetElementIndex, op, converter, setValueOnTargeting)
{
    source.addElementTarget(this, sourceElementIndex, targetElementIndex, op, converter, setValueOnTargeting);
}

Attribute.prototype.removeElementTarget = function(target, sourceElementIndex, targetElementIndex)
{
    if (target)
    {
        this.deleteTarget(new AttributeTargetDesc(target, sourceElementIndex, targetElementIndex));

        // remove this as a source of target 
        target.deleteSource(new AttributeSourceDesc(this, sourceElementIndex, targetElementIndex));
    }
}

Attribute.prototype.removeElementSource = function(source, sourceElementIndex, targetElementIndex)
{
    source.removeElementTarget(this, sourceElementIndex, targetElementIndex);
}

Attribute.prototype.createTarget = function(targetDesc)
{
    this.targets.push(targetDesc);
}

Attribute.prototype.createSource = function(sourceDesc)
{
    this.sources.push(sourceDesc);
}

Attribute.prototype.deleteTarget = function(targetDesc)
{
    for (var i = 0; i < this.targets.length; i++)
    {
        var desc = this.targets[i];
        if (desc.target == targetDesc.target &&
            desc.sourceElementIndex == targetDesc.sourceElementIndex &&
            desc.targetElementIndex == targetDesc.targetElementIndex)
        {
            this.targets.splice(i, 1);
            break;
        }
    }
}

Attribute.prototype.deleteSource = function(sourceDesc)
{
    for (var i = 0; i < this.sources.length; i++)
    {
        var desc = this.sources[i];
        if (desc.source == sourceDesc.source &&
            desc.sourceElementIndex == sourceDesc.sourceElementIndex &&
            desc.targetElementIndex == sourceDesc.targetElementIndex)
        {
            this.sources.splice(i, 1);
            break;
        }
    }
}

Attribute.prototype.copyValue = function(source, op)
{
    source.addTarget(this, op);
    source.removeTarget(this);
}

Attribute.prototype.isContainer = function()
{
    return false;
}

Attribute.prototype.isCollection = function()
{
    return false;
}

Attribute.prototype.isNode = function()
{
    return false;
}

Attribute.prototype.getContainer = function()
{
    return this.container;
}

Attribute.prototype.setContainer = function(container)
{
    this.container = container;
}

Attribute.prototype.getRegistry = function()
{
    return this.registry;
}

Attribute.prototype.setRegistry = function(registry)
{
    this.registry = registry;
}
Attribute.prototype.flagDeserializedFromXML = function()
{
    this.deserialized = true;

    if (this.attrContainer) // also flag container if present, otherwise serialization won't occur
    {
        this.attrContainer.flagDeserializedFromXML();
    }
}
Attribute.prototype.isFlagDeserializedFromXML = function()
{
    return this.deserialized;
}
AttributeContainer.prototype = new Attribute();
AttributeContainer.prototype.constructor = AttributeContainer;

function AttributeContainer()
{
    Attribute.call(this);
    this.className = "AttributeContainer";
    this.attrType = eAttrType.AttributeContainer;

    this.attrNameMap = [];
    this.attrModifiedCountMap = [];
}

AttributeContainer.prototype.destroy = function()
{
    // destroy all registered attributes with this as the container
    for (var i in this.attrNameMap)
    {
        var attr = this.getAttribute(i);
        if (attr.getContainer() == this)
        {
            attr.destroy();
        }
    }

    // call base-class implementation
    Attribute.prototype.destroy.call(this);
}

AttributeContainer.prototype.isContainer = function()
{
    return true;
}

AttributeContainer.prototype.registerAttribute = function(attribute, name)
{
    this.attrNameMap[name] = attribute;
    //this.attrModifiedCountMap[attribute] = 0; // doesn't work
    this.attrModifiedCountMap.push(new Pair(attribute, 0));

    // set the container if null
    if (!attribute.getContainer())
    {
        attribute.setContainer(this);
    }

    attribute.addModifiedCB(AttributeContainer_AttributeModifiedCB, this);
    attribute.addModifiedCB(AttributeContainer_AttributeModifiedCounterCB, this);
}

AttributeContainer.prototype.unregisterAttribute = function(attribute)
{
    for (var i in this.attrNameMap)
    {
        if (this.attrNameMap[i] == attribute)
        {
            attribute.removeModifiedCB(AttributeContainer_AttributeModifiedCB, this);
            attribute.removeModifiedCB(AttributeContainer_AttributeModifiedCounterCB, this);
            delete this.attrNameMap[i];
            break;
        }
    }
}

AttributeContainer.prototype.getAttribute = function(name)
{
    return this.attrNameMap[name];
}

AttributeContainer.prototype.getAttributeAt = function(index)
{
    var count = 0;
    for (var i in this.attrNameMap)
    {
        if (count == index)
        {
            return this.attrNameMap[i];
        }
        count++;
    }
    
    return null;
}

AttributeContainer.prototype.getAttributeName = function(attribute)
{
    var count = 0;
    for (var i in this.attrNameMap)
    {
        if (this.attrNameMap[i] == attribute)
        {
            return this.getAttributeNameAt(count);
        }
        count++;
    }

    return null;
}

AttributeContainer.prototype.getAttributeNameAt = function(index)
{
    var count = 0;
    for (var i in this.attrNameMap)
    {
        if (count == index)
        {
            return i;
        }
        count++;
    }
    
    return null;
}

AttributeContainer.prototype.getAttributeCount = function()
{
    var count = 0;
    for (var i in this.attrNameMap) count++;
    return count;
}

AttributeContainer.prototype.getAttributeModificationCount = function(attribute)
{
    //return this.attrModifiedCountMap[attribute];
    for (var i in this.attrModifiedCountMap)
    {
        if (this.attrModifiedCountMap[i].first == attribute)
        {
            return this.attrModifiedCountMap[i].second;
        }
    }

    return undefined;
}

AttributeContainer.prototype.incrementAttributeModificationCount = function(attribute)
{
    //this.attrModifiedCountMap[attribute]++;
    for (var i in this.attrModifiedCountMap)
    {
        if (this.attrModifiedCountMap[i].first == attribute)
        {
            this.attrModifiedCountMap[i].second++;
            break;
        }
    }
}

AttributeContainer.prototype.addTarget = function(target, op, converter, setValueOnTargeting)
{
    if (target)
    {
        if (op == undefined) op = null;
        if (converter == undefined) converter = null;
        if (setValueOnTargeting == undefined) setValueOnTargeting = true;
        
        var numAttributesToConnect = Math.max(this.getAttributeCount(), target.getAttributeCount());
        if (numAttributesToConnect == 0)
        {
            return;
        }

        var sourceAttr = null;
        var targetAttr = null;
        for (var i = 0; i < numAttributesToConnect; i++)
        {
            sourceAttr = this.getAttributeAt(i);
            targetAttr = target.getAttribute(this.getAttributeNameAt(i));
            if (!sourceAttr || !targetAttr)
            {
                continue;
            }

            sourceAttr.addTarget(targetAttr, op, converter, setValueOnTargeting);
        }
    }
}

AttributeContainer.prototype.removeTarget = function(target)
{
    if (target)
    {
        var numAttributesToConnect = Math.max(this.getAttributeCount(), target.getAttributeCount());
        if (numAttributesToConnect == 0)
        {
            return;
        }

        var sourceAttr = null;
        var targetAttr = null;
        for (var i = 0; i < numAttributesToConnect; i++)
        {
            sourceAttr = this.getAttributeAt(i);
            targetAttr = target.getAttribute(this.getAttributeNameAt(i));
            if (!sourceAttr || !targetAttr)
            {
                continue;
            }

            sourceAttr.removeTarget(targetAttr);
        }
    }
}

AttributeContainer.prototype.synchronize = function(src, syncValues)
{
    if (syncValues == undefined) syncValues = true;

    for (var i in src.attrNameMap)
    {
        var attr = this.getAttribute(i);
        if (!attr)
        {
            attr = src.attrNameMap[i].clone();
            if (!attr) continue;
            attr.setContainer(this);
            this.registerAttribute(attr, i);
        }

        if (attr && syncValues)
        {
            attr.copyValue(src.attrNameMap[i]);
        }
    }
}

function AttributeContainer_AttributeModifiedCB(attribute, container)
{
    for (var i=0; i < container.modifiedCBs.length; i++)
    {
        container.modifiedCBs[i](container, container.modifiedCBsData[i]);
    }
}

function AttributeContainer_AttributeModifiedCounterCB(attribute, container)
{
    container.incrementAttributeModificationCount(attribute);  
}
AttributeRegistry.prototype = new AttributeContainer();
AttributeRegistry.prototype.constructor = AttributeRegistry;

function AttributeRegistry()
{
    AttributeContainer.call(this);
    this.className = "AttributeRegistry";
    this.attrType = eAttrType.AttributeRegistry;

    this.objectCount = 0;
    
    this.typeRegistry = [];
    this.nameRegistry = [];
}

AttributeRegistry.prototype.registerByType = function(attribute, type)
{
    if (this.typeRegistry[type] == undefined)
    {
        this.typeRegistry[type] = new Array();
    }
    
    this.typeRegistry[type].push(attribute);
    this.objectCount += 1;
}

AttributeRegistry.prototype.registerByName = function(attribute, name)
{
    if (name.length == 0)
    {
        name = "unnamed";
    }
    
    if (this.nameRegistry[name] == undefined)
    {
        this.nameRegistry[name] = new Array();
    }

    this.nameRegistry[name].push(attribute);
    this.objectCount += 1;
}

AttributeRegistry.prototype.register = function(attribute)
{
    // register using type
    this.registerByType(attribute, attribute.attrType);
    this.objectCount += 1;
    // register using name attribute if container
    if (attribute.isContainer())
    {
        var name = attribute.getAttribute("name") ||
                   attribute.getAttribute("id");
        if (name)
        {
            this.registerByName(attribute, name.getValueDirect().join(""));
            name.addModifiedCB(AttributeRegistry_AttributeContainerNameModifiedCB, this); 
        }
    }
}

AttributeRegistry.prototype.unregisterByType = function(attribute, type)
{
    if (this.typeRegistry[type])
    {
        this.typeRegistry[type].splice(this.typeRegistry[type].indexOf(attribute), 1);
    }
    this.objectCount -= 1;
}

AttributeRegistry.prototype.unregisterByName = function(attribute, name)
{
    this.objectCount -= 1;
    if (name.length == 0)
    {
        name = "unnamed";
    }
    
    if (this.nameRegistry[name])
    {
        this.nameRegistry[name].splice(this.nameRegistry[name].indexOf(attribute), 1);
    }
}

AttributeRegistry.prototype.unregister = function(attribute)
{
    // register using type
    this.unregisterByType(attribute, attribute.attrType);
    this.objectCount -= 1;
    
    // register using name attribute if container
    if (attribute.isContainer())
    {
        var name = attribute.getAttribute("name") ||
                   attribute.getAttribute("id");
        if (name)
        {
            this.unregisterByName(attribute, name.getValueDirect().join(""));
            name.removeModifiedCB(AttributeRegistry_AttributeContainerNameModifiedCB, this); 
        }
    }
}

AttributeRegistry.prototype.getByType = function(type)
{
    switch (type)
    {
    case eAttrType.Camera:
        {
            var result = [];
            var perspectives = this.getByType(eAttrType.PerspectiveCamera);
            if (perspectives)
            {
                for (var j=0; j < perspectives.length; j++)
                {
                    result.push(perspectives[j]);
                }
            }
            var orthographics = this.getByType(eAttrType.OrthographicCamera);
            if (orthographics)
            {
                for (var j=0; j < orthographics.length; j++)
                {
                    result.push(orthographics[j]);
                }
            }
            return result;
        }
        break;
        
    case eAttrType.Evaluator:
        {
            var result = [];
            for (var i=eAttrType.Evaluator+1; i != eAttrType.Evaluator_End; i++)
            {
                var evaluators = this.getByType(i);
                if (evaluators)
                {
                    for (var j=0; j < evaluators.length; j++)
                    {
                        result.push(evaluators[j]);
                    }
                }    
            }   
            return result;
        }
        break;
        
    default:
        {
            return this.typeRegistry[type];
        }
        break;    
    }
}

AttributeRegistry.prototype.getByName = function(name)
{
    return this.nameRegistry[name];
}

AttributeRegistry.prototype.updateName = function(container, name)
{
    for (var i in this.nameRegistry)
    {
        for (var j=0; j < this.nameRegistry[i].length; j++)
        {
            if (this.nameRegistry[i][j] == container)
            {
                this.nameRegistry[i].splice(j, 1);
                this.registerByName(container, name);
                return;
            }
        }
    }
}

AttributeRegistry.prototype.clear = function()
{
    for (var i in this.typeRegistry)
    {
        this.typeRegistry[i] = [];
    }
    this.typeRegistry = [];
    
    for (var i in this.nameRegistry)
    {
        this.nameRegistry[i] = [];
    } 
    this.nameRegistry = [];

    this.objectCount = 0;
}

AttributeRegistry.prototype.getObjectCount = function ()
{
    return this.typeRegistry.length;
}
AttributeRegistry.prototype.getObject = function(num)
{
    var count = 0;
    for (var i in this.typeRegistry)
    {
        for (var j=0; j < this.typeRegistry[i].length; j++, count++)
        {
            if (count == num)

            {
                return this.typeRegistry[i][j];
            }
        }
    }
    
    return null;
}

function AttributeRegistry_AttributeContainerNameModifiedCB(attribute, container)
{
    container.updateName(attribute.getContainer(), attribute.getValueDirect().join(""));
}
BooleanAttr.prototype = new Attribute();
BooleanAttr.prototype.constructor = BooleanAttr;

function BooleanAttr(value)
{
    Attribute.call(this);
    this.className = "BooleanAttr";
    this.attrType = eAttrType.BooleanAttr;
    this.setValue(value || false);
}

BooleanAttr.prototype.clone = function()
{
    var attr = new BooleanAttr();
    attr.setValue(this.values);
    return attr;
}

BooleanAttr.prototype.getValueDirect = function()
{
    var values = [];
    this.getValue(values);
    return values[0];
}

BooleanAttr.prototype.setValueDirect = function(value, params)
{
    var values = [value];
    this.setValue(value, params);
}

ColorAttr.prototype = new Attribute();
ColorAttr.prototype.constructor = ColorAttr;

function ColorAttr(r, g, b, a)
{
    Attribute.call(this);
    this.className = "ColorAttr";
    this.attrType = eAttrType.ColorAttr;
    var values = [ r || 0, g || 0, b || 0, a || 0 ];
    this.setValue(values);
}

ColorAttr.prototype.clone = function()
{
    var attr = new ColorAttr();
    attr.setValue(this.values);
    return attr;
}

ColorAttr.prototype.getValueDirect = function()
{
    var values = [];
    this.getValue(values);
    return { r: values[0], g: values[1], b: values[2], a: values[3] };
}

ColorAttr.prototype.setValueDirect = function(r, g, b, a, params)
{
    var values = [ r, g, b, a ];
    this.setValue(values, params);
}

Matrix4x4Attr.prototype = new Attribute();
Matrix4x4Attr.prototype.constructor = Matrix4x4Attr;

function Matrix4x4Attr(_11, _12, _13, _14,
                       _21, _22, _23, _24,
                       _31, _32, _33, _34,
                       _41, _42, _43, _44)
{
    Attribute.call(this);
    this.className = "Matrix4x4Attr";
    this.attrType = eAttrType.Matrix4x4Attr;
    var values = [ _11 || 1, _12 || 0, _13 || 0, _14 || 0,
                   _21 || 0, _22 || 1, _23 || 0, _24 || 0,
                   _31 || 0, _32 || 0, _33 || 1, _34 || 0,
                   _41 || 0, _42 || 0, _43 || 0, _44 || 1 ];
    this.setValue(values);
}

Matrix4x4Attr.prototype.clone = function()
{
    var attr = new Matrix4x4Attr();
    attr.setValue(this.values);
    return attr;
}

Matrix4x4Attr.prototype.getValueDirect = function()
{
    var values = [];
    this.getValue(values);
    var result = new Matrix4x4();
    result.loadArray(values);
    return result;
}

Matrix4x4Attr.prototype.setValueDirect = function(matrix, params)
{
    var values = [ matrix._11, matrix._12, matrix._13, matrix._14,
                   matrix._21, matrix._22, matrix._23, matrix._24,
                   matrix._31, matrix._32, matrix._33, matrix._34,
                   matrix._41, matrix._42, matrix._43, matrix._44 ];
    this.setValue(values, params);
}

NumberArrayAttr.prototype = new Attribute();
NumberArrayAttr.prototype.constructor = NumberArrayAttr;

function NumberArrayAttr()
{
    Attribute.call(this);
    this.className = "NumberArrayAttr";
    this.attrType = eAttrType.NumberArrayAttr;
}

NumberArrayAttr.prototype.clone = function()
{
    var attr = new NumberArrayAttr();
    attr.setValue(this.values);
    return attr;
}

NumberArrayAttr.prototype.getValueDirect = function()
{
    var values = [];
    this.getValue(values);
    return values;
}

NumberArrayAttr.prototype.setValueDirect = function(values, params)
{
    this.setValue(values, params);
}

NumberAttr.prototype = new Attribute();
NumberAttr.prototype.constructor = NumberAttr;

function NumberAttr(value)
{
    Attribute.call(this);
    this.className = "NumberAttr";
    this.attrType = eAttrType.NumberAttr;
    this.setValue(value || 0);
}

NumberAttr.prototype.clone = function()
{
    var attr = new NumberAttr();
    attr.setValue(this.values);
    return attr;
}

NumberAttr.prototype.getValueDirect = function()
{
    var values = [];
    this.getValue(values);
    return values[0];
}

NumberAttr.prototype.setValueDirect = function(value, params)
{
    var values = [value];
    this.setValue(values, params);
}

PulseAttr.prototype = new BooleanAttr();
PulseAttr.prototype.constructor = PulseAttr;

function PulseAttr()
{
    BooleanAttr.call(this);
    this.className = "PulseAttr";
    this.attrType = eAttrType.PulseAttr;
}

PulseAttr.prototype.clone = function()
{
    var attr = new PulseAttr();
    attr.setValue(this.values);
    return attr;
}

PulseAttr.prototype.pulse = function()
{
    this.setValueDirect(true);
    this.setValueDirect(false);
}

QuaternionAttr.prototype = new Attribute();
QuaternionAttr.prototype.constructor = QuaternionAttr;

function QuaternionAttr(w, x, y, z)
{
    Attribute.call(this);
    this.className = "QuaternionAttr";
    this.attrType = eAttrType.QuaternionAttr;
    var values = [ w || 1, x || 0, y || 0, z || 0 ];
    this.setValue(values);
}

QuaternionAttr.prototype.clone = function()
{
    var attr = new QuaternionAttr();
    attr.setValue(this.values);
    return attr;
}

QuaternionAttr.prototype.getValueDirect = function()
{
    var values = [];
    this.getValue(values);
    var result = new Quaternion();
    result.loadArray(values);
    return result;
}

QuaternionAttr.prototype.setValueDirect = function(quaternion, params)
{
    var values = [ quaternion.w, quaternion.x, quaternion.y, quaternion.z ];
    this.setValue(values, params);
}

ReferenceAttr.prototype = new Attribute();
ReferenceAttr.prototype.constructor = ReferenceAttr;

function ReferenceAttr(value)
{
    Attribute.call(this);
    this.className = "ReferenceAttr";
    this.attrType = eAttrType.ReferenceAttr;
    this.setValue(value || null);
}

ReferenceAttr.prototype.clone = function()
{
    var attr = new ReferenceAttr();
    attr.setValue(this.values);
    return attr;
}

ReferenceAttr.prototype.getValueDirect = function()
{
    var values = [];
    this.getValue(values);
    return values[0];
}

ReferenceAttr.prototype.setValueDirect = function(value, params)
{
    var values = [value];
    this.setValue(value, params);
}

StringAttr.prototype = new Attribute();
StringAttr.prototype.constructor = StringAttr;

function StringAttr(value)
{
    Attribute.call(this);
    this.className = "StringAttr";
    this.attrType = eAttrType.StringAttr;
    this.setValue(value || "");
}

StringAttr.prototype.clone = function()
{
    var attr = new StringAttr();
    attr.setValue(this.values);
    return attr;
}

StringAttr.prototype.getValueDirect = function()
{
    var values = [];
    this.getValue(values);
    return values;
}

StringAttr.prototype.setValueDirect = function(value, params)
{
    this.setValue(value, params);
}

StringAttr.prototype.setValue = function(values, params)
{
    this.values = [];
    
    // call base-class implementation
    Attribute.prototype.setValue.call(this, values, params);
}

TernaryAttr.prototype = new NumberAttr();
TernaryAttr.prototype.constructor = TernaryAttr;

function TernaryAttr(value)
{
    NumberAttr.call(this, value);
    this.className = "TernaryAttr";
    this.attrType = eAttrType.TernaryAttr;
    
    // TODO: this.setRange(-1, 1);
}

TernaryAttr.prototype.clone = function()
{
    var attr = new TernaryAttr();
    attr.setValue(this.values);
    return attr;
}

Vector2DAttr.prototype = new Attribute();
Vector2DAttr.prototype.constructor = Vector2DAttr;

function Vector2DAttr(x, y)
{
    Attribute.call(this);
    this.className = "Vector2DAttr";
    this.attrType = eAttrType.Vector2DAttr;
    var values = [ x || 0, y || 0 ];
    this.setValue(values);
}

Vector2DAttr.prototype.clone = function()
{
    var attr = new Vector2DAttr();
    attr.setValue(this.values);
    return attr;
}

Vector2DAttr.prototype.getValueDirect = function()
{
    var values = [];
    this.getValue(values);
    return { x: values[0], y: values[1] };
}

Vector2DAttr.prototype.setValueDirect = function(x, y, params)
{
    var values = [ x, y ];
    this.setValue(values, params);
}

Vector3DAttr.prototype = new Attribute();
Vector3DAttr.prototype.constructor = Vector3DAttr;

function Vector3DAttr(x, y, z)
{
    Attribute.call(this);
    this.className = "Vector3DAttr";
    this.attrType = eAttrType.Vector3DAttr;
    var values = [ x || 0, y || 0, z || 0 ];
    this.setValue(values);
}

Vector3DAttr.prototype.clone = function()
{
    var attr = new Vector3DAttr();
    attr.setValue(this.values);
    return attr;
}

Vector3DAttr.prototype.getValueDirect = function()
{
    var values = [];
    this.getValue(values);
    return { x: values[0], y: values[1], z: values[2] };
}

Vector3DAttr.prototype.setValueDirect = function(x, y, z, params)
{
    var values = [ x, y, z ];
    this.setValue(values, params);
}

ViewportAttr.prototype = new Attribute();
ViewportAttr.prototype.constructor = ViewportAttr;

function ViewportAttr(x, y, width, height)
{
    Attribute.call(this);
    this.className = "ViewportAttr";
    this.attrType = eAttrType.ViewportAttr;
    var values = [ x || 0, y || 0, width || 0, height || 0 ];
    this.setValue(values);
}

ViewportAttr.prototype.clone = function()
{
    var attr = new ViewportAttr();
    attr.setValue(this.values);
    return attr;
}

ViewportAttr.prototype.getValueDirect = function()
{
    var values = [];
    this.getValue(values);
    return { x: values[0], y: values[1], width: values[2], height: values[3] };
}

ViewportAttr.prototype.setValueDirect = function(x, y, width, height, params)
{
    var values = [ x, y, width, height ];
    this.setValue(values, params);
}

AttributeVector.prototype = new AttributeContainer();
AttributeVector.prototype.constructor = AttributeVector;

function AttributeVector(allocator) // TODO: not sure if allocator is needed
{
    AttributeContainer.call(this);
    this.className = "AttributeVector";
    this.attrType = eAttrType.AttributeVector;
    
    this.vector = [];
    
    this.allocator = allocator;
    
    this.size = new NumberAttr(0);
    this.baseName = new StringAttr("item");
    this.appendParsedElements = new BooleanAttr(false);
    this.elementModified = new PulseAttr();
    
    this.size.addModifiedCB(AttributeVector_SizeModifiedCB, this);
    this.baseName.addModifiedCB(AttributeVector_BaseNameModifiedCB, this);
    
    this.registerAttribute(this.size, "size");
    this.registerAttribute(this.baseName, "baseName");
    this.registerAttribute(this.appendParsedElements, "appendParsedElements");
    this.registerAttribute(this.elementModified, "elementModified");
}

AttributeVector.prototype.allocatesElements = function() // TODO: necessary (?)
{
    return (this.allocator ? true : false);
}

AttributeVector.prototype.push_back = function(item)
{
    this.addElement(this.vector.length, item);

    this.size.setValueDirect(this.vector.length);
}

AttributeVector.prototype.resize = function(size)
{
    this.size.setValueDirect(size);
}

AttributeVector.prototype.clear = function()
{
    this.resize(0);
}

AttributeVector.prototype.getAt = function(index)
{
    if (this.vector.length > index)
    {
        return this.vector[index];
    }
    
    return null;
}

AttributeVector.prototype.setAt = function(index, item)
{
    if (this.vector.length > index)
    {
        this.vector[index] = item;
    }
}

AttributeVector.prototype.prev = function(element)
{
    for (var i=0; i < this.vector.length; i++)
    {
        if (this.vector[i] == element)
        {
            if (i > 0) return this.vector[i-1];
            break;
        }        
    }
    
    return null;
}

AttributeVector.prototype.next = function(element)
{
    for (var i=0; i < this.vector.length; i++)
    {
        if (this.vector[i] == element)
        {
            if (i < (this.vector.length - 1)) return this.vector[i+1];
            break;
        }        
    }
    
    return null;
}

AttributeVector.prototype.addElement = function(index, element)
{
    this.vector.splice(index, 0, element);
}

AttributeVector.prototype.removeElement = function(index)
{
    this.vector.splice(index, 1);
}

AttributeVector.prototype.Size = function()
{
    return this.size.getValueDirect();
}

AttributeVector.prototype.AppendParsedElements = function()
{
    return this.appendParsedElements.getValueDirect();
}

AttributeVector.prototype.setElementName = function(element, name)
{
    this.unregisterAttribute(element); // don't allow registration under multiple names
    this.registerAttribute(element, name);
    
    // TODO: add to element name map
    console.debug("TODO: add to element name map");
}

AttributeVector.prototype.synchronize = function(src, syncValues)
{
    // call base-class implementation
    AttributeContainer.prototype.synchronize.call(this, src, syncValues);

    // copy elements
    this.clear();
    for (var i = 0; i < src.vector.length; i++)
    {
        this.push_back(src.vector[i]);
    }
}

AttributeVector.prototype.isCollection = function()
{
    return true;
}

AttributeVector.prototype.sizeModified = function()
{
    var lastSize = this.vector.length;
    var nextSize = this.size.getValueDirect();
    var start, end;

    if (nextSize > lastSize)
    {
        start = lastSize;
        end = start + (nextSize - lastSize);

        for (var i = start; i < end; i++)
        {
            this.addElement(i, this.allocator ? this.allocator.allocate() : null);
        }
    }
    else if (nextSize < lastSize)
    {
        start = lastSize;
        end = start - (lastSize - nextSize);

        for (var i = start - 1; i >= end; i--)
        {
            this.removeElement(i);
        }
    }
}

function AttributeVector_SizeModifiedCB(attribute, container)
{
    container.sizeModified();
}

function AttributeVector_BaseNameModifiedCB(attribute, container)
{
}

StyleAttr.prototype = new AttributeContainer();
StyleAttr.prototype.constructor = StyleAttr;

function StyleAttr()
{
    AttributeContainer.call(this);
    this.className = "StyleAttr";
    this.attrType = eAttrType.StyleAttr;

    this.setOp = new NumberAttr(eAttrSetOp.Replace);
    this.styleUrl = new StringAttr();

    this.styleUrl.addModifiedCB(StyleAttr_StyleUrlModifiedCB, this);
    
    this.registerAttribute(this.setOp, "setOp");
    this.registerAttribute(this.styleUrl, "styleUrl");
}

StyleAttr.prototype.updateStyle = function(style)
{
    // implemented by derived classes
}

StyleAttr.prototype.styleUrlModified = function()
{
    var styleUrl = this.styleUrl.getValueDirect().join("");
    if (this.registry)
    {
        this.updateStyle(this.registry.find(styleUrl));
    }
}

function StyleAttr_StyleUrlModifiedCB(attribute, container)
{
    container.styleUrlModified();
}

StylesAttr.prototype = new AttributeVector();
StylesAttr.prototype.constructor = StylesAttr;

function StylesAttr()
{
    AttributeVector.call(this);
    this.className = "StylesAttr";
    this.attrType = eAttrType.StylesAttr;

    this.registeredCBs = [];
    this.registeredCBsData = [];
    
    this.enabled = new BooleanAttr(true);

    this.registerAttribute(this.enabled, "enabled");
}

StylesAttr.prototype.updateStyle = function(style)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        return;
    }

    for (var i = 0; i < style.Size(); i++)
    {
        for (var j = 0; j < this.Size(); j++)
        {
            if (this.vector[j].attrType == style.vector[i].attrType)
            {
                this.vector[j].updateStyle(style.vector[i]);
                break;
            }
        }
    }
}

StylesAttr.prototype.registerStyle = function(style, name)
{
    this.push_back(style);
    this.setElementName(style, name);
    this.alertRegisteredCBs(style, true);
}

StylesAttr.prototype.unregisterStyle = function(style)
{
    for (var i in this.vector)
    {
        if (this.vector[i] == style)
        {
            this.alertRegisteredCBs(style, false);
            delete this.vector[i];
            break;
        }
    }
}

StylesAttr.prototype.addRegisteredCB = function(callback, data)
{
    this.registeredCBs.push(callback);
    this.registeredCBsData.push(data);
}

StylesAttr.prototype.alertRegisteredCBs = function(style, registered)
{
    for (var i = 0; i < this.registeredCBs.length; i++)
    {
        this.registeredCBs[i](style, this.registeredCBs[i]);
    }
}

StylesAttr.prototype.push_back = function(item)
{
    // call base-class implementation
    AttributeVector.prototype.push_back.call(this, item);

    this.alertRegisteredCBs(item, true);
}

StylesAttr.prototype.getStyle = function(type)
{
    for (var i = 0; i < this.Size(); i++)
    {
        if (this.vector[i].attrType == type)
        {
            return this.vector[i];
        }
    }

    return undefined;
}

StyleMapAttr.prototype = new AttributeContainer();
StyleMapAttr.prototype.constructor = StyleMapAttr;

function StyleMapAttr()
{
    AttributeContainer.call(this);
    this.className = "StyleMapAttr";
    this.attrType = eAttrType.StyleMapAttr;

    this.eventType = eEventType.Unknown;
    this.targetContainer = null;
    
    this.event = new StringAttr();
    this.styles = new StylesAttr();
    this.styleUrl = new StringAttr();
    this.target = new StringAttr();

    this.event.addModifiedCB(StyleMapAttr_EventModifiedCB, this);
    this.styleUrl.addModifiedCB(StyleMapAttr_styleUrlModifiedCB, this);
    this.target.addModifiedCB(StyleMapAttr_TargetModifiedCB, this);

    this.registerAttribute(this.event, "event");
    this.registerAttribute(this.styleUrl, "styleUrl");
    this.registerAttribute(this.target, "target");
}

StyleMapAttr.prototype.getStyles = function(eventType)
{
    var styles = null;
    var target = null;

    if (this.eventType == eventType)
    {
        styles = this.styles;
        target = this.targetContainer;
    }

    return { styles: styles, target: target };
}

StyleMapAttr.prototype.setStyles = function(styles)
{
    this.styles = styles;
}

StyleMapAttr.prototype.setTargetContainer = function(targetContainer)
{
    this.targetContainer = targetContainer;
}

StyleMapAttr.prototype.eventModified = function()
{
    var eventName = this.event.getValueDirect().join("");

    this.eventType = eEventNameMap[eventName];
}

StyleMapAttr.prototype.styleUrlModified = function()
{
    var styleUrl = this.styleUrl.getValueDirect();
    if (styleUrl[0] == '#')
    {
        styleUrl.splice(0, 1);
    }
    styleUrl = styleUrl.join("");

    var styles = this.registry.find(styleUrl);
    if (styles)
    {
        this.styles = styles;
    }
}

StyleMapAttr.prototype.targetModified = function()
{
    var target = this.target.getValueDirect().join("");

    this.targetContainer = this.registry.find(target);
}

function StyleMapAttr_EventModifiedCB(attribute, container)
{
    container.eventModified();
}

function StyleMapAttr_styleUrlModifiedCB(attribute, container)
{
    container.styleUrlModified();
}

function StyleMapAttr_TargetModifiedCB(attribute, container)
{
    container.targetModified();
}

StyleMapAttrAllocator.prototype = new Allocator();
StyleMapAttrAllocator.prototype.constructor = StyleMapAttrAllocator;

function StyleMapAttrAllocator()
{
}

StyleMapAttrAllocator.prototype.allocate = function()
{
    return new StyleMapAttr();
}

StylesMapAttr.prototype = new AttributeVector();
StylesMapAttr.prototype.constructor = StylesMapAttr;

function StylesMapAttr()
{
    AttributeVector.call(this, new StyleMapAttrAllocator());
    this.className = "StylesMapAttr";
    this.attrType = eAttrType.StylesMapAttr;

    this.stylesEnabledMap = [];

    this.size.addModifiedCB(StylesMapAttr_SizeModifiedCB, this);

    this.appendParsedElements.setValueDirect(true);
}

StylesMapAttr.prototype.getStyles = function(eventType)
{
    var styles = null;
    var enabled = false;
    var target = null;

    for (var i = 0; i < this.Size(); i++)
    {
        var result = this.vector[i].getStyles(eventType);
        if (result.styles)
        {
            styles = result.styles;
            target = result.target;
            if (this.stylesEnabledMap[result.styles])
            {
                enabled = this.stylesEnabledMap[result.styles];
            }
        }
    }

    return { styles: styles, target: target, enabled: enabled };
}

StylesMapAttr.prototype.StylesMapAttr_SizeModified = function()
{
    for (var i = 0; i < this.Size(); i++)
    {
        if (!(this.vector[i].registry))
        {
            this.vector[i].setRegistry(this.registry);
        }

        if (!(this.stylesEnabledMap[this.vector[i].styles]))
        {
            this.stylesEnabledMap[this.vector[i].styles] = new BooleanAttr(true);
        }
    }
}

function StylesMapAttr_SizeModifiedCB(attribute, container)
{
    container.StylesMapAttr_SizeModified();
}
KeyframeAttr.prototype = new AttributeContainer();
KeyframeAttr.prototype.constructor = KeyframeAttr;

function KeyframeAttr()
{
    AttributeContainer.call(this);
    this.className = "KeyframeAttr";
    this.attrType = eAttrType.KeyframeAttr;
    
    this.time = new NumberAttr();
    this.value = new NumberAttr();
    this.shape = new NumberAttr();
    this.params = new AttributeVector();
    
    for (var i=0; i < 6; i++)
    {
        this.params.push_back(new NumberAttr(0));
    }
    
    this.registerAttribute(this.time, "time");
    this.registerAttribute(this.value, "value");
    this.registerAttribute(this.shape, "shape");
    this.registerAttribute(this.params, "params");
    
    this.getTime = function() { return this.time.getValueDirect(); }
    this.getValue = function() { return this.value.getValueDirect(); }
    this.getShape = function() { return this.shape.getValueDirect(); }
    this.getParams = function(i) { return this.params.getAt(i).getValueDirect(); }
}

KeyframesAttr.prototype = new AttributeVector();
KeyframesAttr.prototype.constructor = KeyframesAttr;

function KeyframesAttr()
{
    AttributeVector.call(this);
    this.className = "KeyframesAttr";
    this.attrType = eAttrType.KeyframesAttr;
}
    
BBoxAttr.prototype = new AttributeContainer();
BBoxAttr.prototype.constructor = BBoxAttr;

function BBoxAttr()
{
    AttributeContainer.call(this);
    this.className = "BBoxAttr";
    this.attrType = eAttrType.BBoxAttr;
    
    this.min = new Vector3DAttr();
    this.max = new Vector3DAttr();
    
    this.registerAttribute(this.min, "min");
    this.registerAttribute(this.max, "max");
}

BBoxAttr.prototype.setValueDirect = function(min, max)
{
    this.min.setValueDirect(min.x, min.y, min.z);
    this.max.setValueDirect(max.x, max.y, max.z);
}

ImageAttr.prototype = new AttributeContainer();
ImageAttr.prototype.constructor = ImageAttr;

function ImageAttr()
{
    AttributeContainer.call(this);
    this.className = "ImageAttr";
    this.attrType = eAttrType.ImageAttr;

    this.width = new NumberAttr(0);
    this.height = new NumberAttr(0);
    this.byteAlignment = new NumberAttr(0);
    this.pixelFormat = new NumberAttr(ePixelFormat.Unknown);
    this.pixels = new NumberArrayAttr();
    
    this.registerAttribute(this.width, "width");
    this.registerAttribute(this.height, "height");
    this.registerAttribute(this.byteAlignment, "byteAlignment");
    this.registerAttribute(this.pixelFormat, "pixelFormat");
    this.registerAttribute(this.pixels, "pixels");    
}

RectAttr.prototype = new AttributeContainer();
RectAttr.prototype.constructor = RectAttr;

function RectAttr()
{
    AttributeContainer.call(this);
    this.className = "RectAttr";
    this.attrType = eAttrType.RectAttr;

    this.left = new NumberAttr(0);
    this.top = new NumberAttr(0);
    this.right = new NumberAttr(0);
    this.bottom = new NumberAttr(0);

    this.registerAttribute(this.left, "left");
    this.registerAttribute(this.top, "top");
    this.registerAttribute(this.right, "right");
    this.registerAttribute(this.bottom, "bottom");
}

RectAttr.prototype.getValueDirect = function()
{
    var rect = new Rect();
    rect.left = this.left.getValueDirect();
    rect.top = this.top.getValueDirect();
    rect.right = this.right.getValueDirect();
    rect.bottom = this.bottom.getValueDirect();
    return rect;
}

RectAttr.prototype.setValueDirect = function(rect)
{
    this.left.setValueDirect(rect.left);
    this.top.setValueDirect(rect.top);
    this.right.setValueDirect(rect.right);
    this.bottom.setValueDirect(rect.bottom);
}

RectAttr.prototype.containsPoint = function(x, y)
{
    if (x >= this.left.getValueDirect() &&
        y >= this.top.getValueDirect() &&
        x <= this.right.getValueDirect() &&
        y <= this.bottom.getValueDirect())
        return true;

    return false;
}

FontStyleAttr.prototype = new StyleAttr();
FontStyleAttr.prototype.constructor = FontStyleAttr;

function FontStyleAttr()
{
    StyleAttr.call(this);
    this.className = "FontStyleAttr";
    this.attrType = eAttrType.FontStyleAttr;

    this.antialiasType = new NumberAttr(eImageAntialiasOp.EightPass);
    this.borderColor = new ColorAttr(0, 0, 0, 1);
    this.borderWidth = new NumberAttr(2);
    this.color = new ColorAttr(1, 1, 1, 1);
    this.effects = new StringAttr();
    this.font = new StringAttr("Arial");
    this.opacity = new NumberAttr(1);
    this.size = new NumberAttr(18);
    this.style = new StringAttr("Bold");

    this.registerAttribute(this.antialiasType, "antialiasType");
    this.registerAttribute(this.borderColor, "borderColor");
    this.registerAttribute(this.borderWidth, "borderWidth");
    this.registerAttribute(this.color, "color");
    this.registerAttribute(this.effects, "effects");
    this.registerAttribute(this.font, "font");
    this.registerAttribute(this.opacity, "opacity");
    this.registerAttribute(this.size, "size");
    this.registerAttribute(this.style, "style");
}

FontStyleAttr.prototype.updateStyle = function(style)
{
    var setOp = style.setOp.getValueDirect();

    // antialiasType
    if (style.getAttributeModificationCount(style.antialiasType))
    {
        this.antialiasType.copyValue(style.antialiasType, setOp);
    }

	// borderColor
    if (style.getAttributeModificationCount(style.borderColor))
    {
        this.borderColor.copyValue(style.borderColor, setOp);
    }

	// borderWidth
    if (style.getAttributeModificationCount(style.borderWidth))
    {
        this.borderWidth.copyValue(style.borderWidth, setOp);
    }

	// color
    if (style.getAttributeModificationCount(style.color))
    {
        this.color.copyValue(style.color, setOp);
    }
	
	// effects
    if (style.getAttributeModificationCount(style.effects))
    {
        this.effects.copyValue(style.effects, setOp);
    }

	// font
    if (style.getAttributeModificationCount(style.font))
    {
        this.font.copyValue(style.font, setOp);
    }

	// opacity
    if (style.getAttributeModificationCount(style.opacity))
    {
        this.opacity.copyValue(style.opacity, setOp);
    }

	// size
    if (style.getAttributeModificationCount(style.size))
    {
        this.size.copyValue(style.size, setOp);
    }

	// style
    if (style.getAttributeModificationCount(style.style))
    {
        this.style.copyValue(style.style, setOp);
    }
}

LabelStyleAttr.prototype = new StyleAttr();
LabelStyleAttr.prototype.constructor = LabelStyleAttr;

function LabelStyleAttr()
{
    StyleAttr.call(this);
    this.className = "LabelStyleAttr";
    this.attrType = eAttrType.LabelStyleAttr;

    this.angle = new NumberAttr(0);
    this.backgroundColor = new ColorAttr(0, 0, 0, 1);
    this.backgroundOpacity = new NumberAttr(0);
    this.fontStyle = new FontStyleAttr();
    this.format = new StringAttr("left");
    this.height = new NumberAttr(0);
    this.offset = new Vector2DAttr(0, 0);
    this.padding = new NumberAttr(0);
    this.scale = new Vector3DAttr(1, 1, 1);
    this.textAlign = new StringAttr("middleRight");
    this.width = new NumberAttr(0);

    this.registerAttribute(this.angle, "angle");
    this.registerAttribute(this.backgroundColor, "backgroundColor");
    this.registerAttribute(this.backgroundOpacity, "backgroundOpacity");
    this.registerAttribute(this.fontStyle, "fontStyle");
    this.registerAttribute(this.format, "format");
    this.registerAttribute(this.height, "height");
    this.registerAttribute(this.offset, "offset");
    this.registerAttribute(this.padding, "padding");
    this.registerAttribute(this.scale, "scale");
    this.registerAttribute(this.textAlign, "textAlign");
    this.registerAttribute(this.width, "width");
}

LabelStyleAttr.prototype.updateStyle = function(style)
{
    var setOp = style.setOp.getValueDirect();

    // angle
    if (style.getAttributeModificationCount(style.angle))
    {
        this.angle.copyValue(style.angle, setOp);
    }

    // backgroundColor
    if (style.getAttributeModificationCount(style.backgroundColor))
    {
        this.backgroundColor.copyValue(style.backgroundColor, setOp);
    }

    // backgroundOpacity
    if (style.getAttributeModificationCount(style.backgroundOpacity))
    {
        this.backgroundOpacity.copyValue(style.backgroundOpacity, setOp);
    }

    // fontStyle
    this.fontStyle.updateStyle(style.fontStyle);

    // format
    if (style.getAttributeModificationCount(style.format))
    {
        this.format.copyValue(style.format, setOp);
    }

    // height
    if (style.getAttributeModificationCount(style.height))
    {
        this.height.copyValue(style.height, setOp);
    }

    // offset
    if (style.getAttributeModificationCount(style.offset))
    {
        this.offset.copyValue(style.offset, setOp);
    }

    // padding
    if (style.getAttributeModificationCount(style.padding))
    {
        this.padding.copyValue(style.padding, setOp);
    }

    // scale
    if (style.getAttributeModificationCount(style.scale))
    {
        this.scale.copyValue(style.scale, setOp);
    }

    // textAlign
    if (style.getAttributeModificationCount(style.textAlign))
    {
        this.textAlign.copyValue(style.textAlign, setOp);
    }

    // width
    if (style.getAttributeModificationCount(style.width))
    {
        this.width.copyValue(style.width, setOp);
    }
}

IconStyleAttr.prototype = new StyleAttr();
IconStyleAttr.prototype.constructor = IconStyleAttr;

function IconStyleAttr()
{
    StyleAttr.call(this);
    this.className = "IconStyleAttr";
    this.attrType = eAttrType.IconStyleAttr;

    this.alphaUrl = new StringAttr("");
    this.color = new ColorAttr(1, 1, 1, 1);
    this.opacity = new NumberAttr(1);
    this.scale = new Vector3DAttr(1, 1, 1);
    this.url = new StringAttr("");

    this.registerAttribute(this.alphaUrl, "alphaUrl");
    this.registerAttribute(this.color, "color");
    this.registerAttribute(this.opacity, "opacity");
    this.registerAttribute(this.scale, "scale");
    this.registerAttribute(this.url, "url");
}

IconStyleAttr.prototype.updateStyle = function(style)
{
    var setOp = style.setOp.getValueDirect();

    // alphaUrl
    if (style.getAttributeModificationCount(style.alphaUrl))
    {
        this.alphaUrl.copyValue(style.alphaUrl, setOp);
    }

    // color
    if (style.getAttributeModificationCount(style.color))
    {
        this.color.copyValue(style.color, setOp);
    }

    // opacity
    if (style.getAttributeModificationCount(style.opacity))
    {
        this.opacity.copyValue(style.opacity, setOp);
    }

    // scale
    if (style.getAttributeModificationCount(style.scale))
    {
        this.scale.copyValue(style.scale, setOp);
    }

    // url
    if (style.getAttributeModificationCount(style.url))
    {
        this.url.copyValue(style.url, setOp);
    }
}

HTMLLabelStyleAttr.prototype = new StyleAttr();
HTMLLabelStyleAttr.prototype.constructor = HTMLLabelStyleAttr;

function HTMLLabelStyleAttr()
{
    StyleAttr.call(this);
    this.className = "HTMLLabelStyleAttr";
    this.attrType = eAttrType.HTMLLabelStyleAttr;
    
    this.bgColor = new ColorAttr(1, 1, 1, 1); // white
    this.height = new NumberAttr(0); // 0 (auto-calculate)
    this.html = new StringAttr(); // empty string
    this.left = new NumberAttr(0);
    //if (!(this.scrollBarLabelStyle = New<ScrollBarLabelStyleAttr>())) return;
    this.top = new NumberAttr(0);
    this.url = new StringAttr(); // empty string
    this.width = new NumberAttr(0); // 0 (auto-calculate)
    
    this.registerAttribute(this.bgColor, "bgColor");
    this.registerAttribute(this.height, "height");
    this.registerAttribute(this.html, "html");
    this.registerAttribute(this.html, "userData");          // for CDATA
    this.registerAttribute(this.left, "left");
    //this.registerAttribute(this.scrollBarLabelStyle, "scrollBarLabelStyle");
    this.registerAttribute(this.top, "top");
    this.registerAttribute(this.url, "url");
    this.registerAttribute(this.width, "width");
}

BalloonTipLabelStyleAttr.prototype = new StyleAttr();
BalloonTipLabelStyleAttr.prototype.constructor = BalloonTipLabelStyleAttr;

function BalloonTipLabelStyleAttr()
{
    StyleAttr.call(this);
    this.className = "BalloonTipLabelStyleAttr";
    this.attrType = eAttrType.BalloonTipLabelStyleAttr;
    
    this.balloonOffset = new NumberAttr(100);
    this.bgColor = new ColorAttr(1, 1, 1, 1);
    this.displayMode = new StringAttr("default");
    this.htmlLabelStyle = new HTMLLabelStyleAttr();
    this.text = new StringAttr();
    this.textColor = new ColorAttr(0, 0, 0, 1);
	
	this.registerAttribute(this.balloonOffset, "balloonOffset");
	this.registerAttribute(this.bgColor, "bgColor");
	this.registerAttribute(this.displayMode, "displayMode");
	this.registerAttribute(this.htmlLabelStyle, "htmlLabelStyle");
	this.registerAttribute(this.text, "text");
	this.registerAttribute(this.textColor, "textColor");
}

BalloonTipLabelStyleAttr.prototype.updateStyle = function(style)
{
    var setOp = style.setOp.getValueDirect();

    // balloonOffset
    if (style.getAttributeModificationCount(style.balloonOffset))
    {
        this.balloonOffset.copyValue(style.balloonOffset, setOp);
    }

    // bgColor
    if (style.getAttributeModificationCount(style.bgColor))
    {
        this.bgColor.copyValue(style.bgColor, setOp);
    }

    // displayMode
    if (style.getAttributeModificationCount(style.displayMode))
    {
        this.displayMode.copyValue(style.displayMode, setOp);
    }

    // htmlLabelStyle
    this.htmlLabelStyle.updateStyle(style.htmlLabelStyle);

    // text
    if (style.getAttributeModificationCount(style.text))
    {
        this.text.copyValue(style.text, setOp);
    }

    // textColor
    if (style.getAttributeModificationCount(style.textColor))
    {
        this.textColor.copyValue(style.textColor, setOp);
    }
}

RenderableElementStyleAttr.prototype = new StyleAttr();
RenderableElementStyleAttr.prototype.constructor = RenderableElementStyleAttr;

function RenderableElementStyleAttr()
{
    StyleAttr.call(this);
    this.className = "RenderableElementStyleAttr";
    this.attrType = eAttrType.RenderableElementStyleAttr;

    this.hasFocus = new TernaryAttr(0);
    this.selected = new TernaryAttr(0);

    this.registerAttribute(this.hasFocus, "hasFocus");
    this.registerAttribute(this.selected, "selected");
}

RenderableElementStyleAttr.prototype.updateStyle = function(style)
{
    var setOp = style.setOp.getValueDirect();

    // hasFocus
    if (style.getAttributeModificationCount(style.hasFocus))
    {
        this.hasFocus.copyValue(style.hasFocus, setOp);
    }

    // selected
    if (style.getAttributeModificationCount(style.selected))
    {
        this.selected.copyValue(style.selected, setOp);
    }
}

PlaneAttr.prototype = new AttributeContainer();
PlaneAttr.prototype.constructor = PlaneAttr;

function PlaneAttr()
{
    AttributeContainer.call(this);
    this.className = "PlaneAttr";
    this.attrType = eAttrType.PlaneAttr;

    this.point = new Vector3DAttr(0, 0, 0);
    this.normal = new Vector3DAttr(0, 0, 1);
    this.dot = new NumberAttr(0);

    this.registerAttribute(this.point, "point");
    this.registerAttribute(this.normal, "normal");
    this.registerAttribute(this.dot, "dot");
}

PlaneAttr.prototype.getValueDirect = function()
{
    var point = this.point.getValueDirect();
    var normal = this.normal.getValueDirect();
    var plane = new Plane(new Vector3D(point.x, point.y, point.z), new Vector3D(normal.x, normal.y, normal.z));
    return plane;
}

PlaneAttr.prototype.setValueDirect = function(plane)
{
    this.point.setValueDirect(plane.point.x, plane.point.y, plane.point.z);
    this.normal.setValueDirect(plane.normal.x, plane.normal.y, plane.normal.z);
    this.dot.setValueDirect(plane.dot);
}

ViewVolumeAttr.prototype = new AttributeContainer();
ViewVolumeAttr.prototype.constructor = ViewVolumeAttr;

function ViewVolumeAttr()
{
    AttributeContainer.call(this);
    this.className = "ViewVolumeAttr";
    this.attrType = eAttrType.ViewVolumeAttr;

    this.left = new PlaneAttr();
    this.right = new PlaneAttr();
    this.top = new PlaneAttr();
    this.bottom = new PlaneAttr();
    this.near = new PlaneAttr();
    this.far = new PlaneAttr();

    this.registerAttribute(this.left, "left");
    this.registerAttribute(this.right, "right");
    this.registerAttribute(this.top, "top");
    this.registerAttribute(this.bottom, "bottom");
    this.registerAttribute(this.near, "near");
    this.registerAttribute(this.far, "far");
}

ViewVolumeAttr.prototype.setValueDirect = function(left, right, top, bottom, near, far)
{
    this.left.setValueDirect(left);
    this.right.setValueDirect(right);
    this.top.setValueDirect(top);
    this.bottom.setValueDirect(bottom);
    this.near.setValueDirect(near);
    this.far.setValueDirect(far);
}
function setAttributeValue(attribute, value)
{
    switch (attribute.attrType)
    {
    case eAttrType.BooleanAttr:
        {
            if (value == "false" || value == "0")
                attribute.setValueDirect(false);
            else 
                attribute.setValueDirect(true);
        }
        break;

    case eAttrType.ColorAttr:
    case eAttrType.Matrix4x4Attr:
    case eAttrType.NumberArrayAttr:
    case eAttrType.Vector2DAttr:
    case eAttrType.Vector3DAttr:
    case eAttrType.ViewportAttr:
        {
            // convert from string to numeric
            for (var i = 0; i < value.length; i++)
            {
                value[i] = parseFloat(value[i]);
            }
            attribute.setValue(value);
        }
        break;   
    
    case eAttrType.NumberAttr:
        {
            // convert from string to numeric
            attribute.setValueDirect(parseFloat(value));
        }
        break;

    default:
        {
            attribute.setValue(value);
        }
        break;
    }
}
Agent.prototype = new AttributeContainer();
Agent.prototype.constructor = Agent;

function Agent()
{
    AttributeContainer.call(this);
    this.className = "Agent";
    
    this.running = false;
    
    this.name = new StringAttr("");
    this.enabled = new BooleanAttr(true);
    
    this.registerAttribute(this.name, "name");
    this.registerAttribute(this.enabled, "enabled");
}

Agent.prototype.start = function()
{
    this.running = true;
}

Agent.prototype.stop = function()
{
    this.running = false;
}

Agent.prototype.pause = function()
{
    this.running = false;
}



function RayIntersectRecord()
{
    this.distance = Infinity;
    this.pointModel = new Vector3D();
    this.pointWorld = new Vector3D();
    this.pointView = new Vector3D();
    this.triIndex = 0;
}

function RayIntersectParams(rayOrigin, 
                            rayDir,
                            nearDistance,
                            farDistance,
                            worldMatrix,
                            viewMatrix,
                            scale,
                            doubleSided,
                            clipPlanes)
{
    this.rayOrigin = rayOrigin || new Vector3D();
    this.rayDir = rayDir || new Vector3D();
    this.nearDistance = nearDistance || 0;
    this.farDistance = farDistance || 0;
    this.worldMatrix = worldMatrix || new Matrix4x4();
    this.viewMatrix = viewMatrix || new Matrix4x4();
    this.worldViewMatrix = this.worldMatrix.multiply(this.viewMatrix);
    this.scale = scale || 0;
    this.doubleSided = doubleSided || false;
    this.clipPlanes = clipPlanes || new Array();
    this.intersects = false;
    this.intersectRecord = new RayIntersectRecord();
}

function Triangle(x0, y0, z0, x1, y1, z1, x2, y2, z2)
{
    this.v0 = new Vector3D(x0, y0, z0);
    this.v1 = new Vector3D(x1, y1, z1);
    this.v2 = new Vector3D(x2, y2, z2);
}

function Sphere()
{
    this.center = new Vector3D();
    this.radius = 0;
    this.xcenter = new Vector3D(); // transformed center
}

function Region(minX, minY, minZ, maxX, maxY, maxZ)
{
    this.min = new Vector3D(minX, minY, minZ);
    this.max = new Vector3D(maxX, maxY, maxZ);
    
    this.xpos = new Plane();
    this.xneg = new Plane();
    this.ypos = new Plane();
    this.yneg = new Plane();
    this.zpos = new Plane();
    this.zneg = new Plane();
    
    this.xpos_ypos_zpos = new Plane();
    this.xpos_ypos_zneg = new Plane();
    this.xpos_yneg_zpos = new Plane();
    this.xpos_yneg_zneg = new Plane();
    this.xneg_ypos_zpos = new Plane();
    this.xneg_ypos_zneg = new Plane();
    this.xneg_yneg_zpos = new Plane();
    this.xneg_yneg_zneg = new Plane();
    
    this.setPlanes();
}

Region.prototype.setPlanes = function()
{
    // generate axis planes
    this.xpos = new Plane(this.max, new Vector3D( 1,  0,  0));
    this.xneg = new Plane(this.min, new Vector3D(-1,  0,  0));
    this.ypos = new Plane(this.max, new Vector3D( 0,  1,  0));
    this.yneg = new Plane(this.min, new Vector3D( 0, -1,  0));
    this.zpos = new Plane(this.max, new Vector3D( 0,  0,  1));
    this.zneg = new Plane(this.min, new Vector3D( 0,  0, -1));

    // define corner points of region
    var xp_yp_zp = new Vector3D(this.max.x, this.max.y, this.max.z);
    var xp_yp_zn = new Vector3D(this.max.x, this.max.y, this.min.z);
    var xp_yn_zp = new Vector3D(this.max.x, this.min.y, this.max.z);
    var xp_yn_zn = new Vector3D(this.max.x, this.min.y, this.min.z);
    var xn_yp_zp = new Vector3D(this.min.x, this.max.y, this.max.z);
    var xn_yp_zn = new Vector3D(this.min.x, this.max.y, this.min.z);
    var xn_yn_zp = new Vector3D(this.min.x, this.min.y, this.max.z);
    var xn_yn_zn = new Vector3D(this.min.x, this.min.y, this.min.z);

    // generate corner planes
    this.xpos_ypos_zpos = new Plane(xp_yp_zp, xp_yp_zp - xn_yn_zn);
    this.xpos_ypos_zneg = new Plane(xp_yp_zn, xp_yp_zn - xn_yn_zp);
    this.xpos_yneg_zpos = new Plane(xp_yn_zp, xp_yn_zp - xn_yp_zn);
    this.xpos_yneg_zneg = new Plane(xp_yn_zn, xp_yn_zn - xn_yp_zp);
    this.xneg_ypos_zpos = new Plane(xn_yp_zp, xn_yp_zp - xp_yn_zn);
    this.xneg_ypos_zneg = new Plane(xn_yp_zn, xn_yp_zn - xp_yn_zp);
    this.xneg_yneg_zpos = new Plane(xn_yn_zp, xn_yn_zp - xp_yp_zn);
    this.xneg_yneg_zneg = new Plane(xn_yn_zn, xn_yn_zn - xp_yp_zp);   
}

Region.prototype.containsGeometry = function(tris, triIndices)
{
    var result = [];
    
    for (var i=0; i < triIndices.length; i++)
    {
        if (this.containsTriangle(tris[triIndices[i]]))
        {
            result.push(triIndices[i]);
        }
    }
    
    return result;
}

Region.prototype.containsTriangle = function(tri)
{
    var verts = new Array(3);
    verts[0] = tri.v0;
    verts[1] = tri.v1;
    verts[2] = tri.v2;
    
    // check if any vertices are within the region bounds (quick accept)
    for (var i=0; i < 3; i++)
    {
        if (verts[i].x >= this.min.x &&
            verts[i].y >= this.min.y &&
            verts[i].z >= this.min.z &&
            verts[i].x <= this.max.x &&
            verts[i].y <= this.max.y &&
            verts[i].z <= this.max.z)
        {
            return true;
        }
    }
    
    // check if all vertices are outside a region plane (quick reject)
    if (triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.xpos) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.xneg) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.ypos) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.yneg) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.zpos) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.zneg) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.xpos_ypos_zpos) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.xpos_ypos_zneg) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.xpos_yneg_zpos) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.xpos_yneg_zneg) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.xneg_ypos_zpos) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.xneg_ypos_zneg) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.xneg_yneg_zpos) ||
        triangleOnPositiveSideOfPlane(verts[0], verts[1], verts[2], this.xneg_yneg_zneg))
    {
        return false;
    }
    
    // triangle has survived trivial acceptance/rejection tests...

    // test triangle line segments for cube face penetration
    // (only test segments if they span the face plane)
    var result;
    for (var i=0; i < 3; i++)
    {
        var a = verts[i];
        var b = verts[(i+1)%3];

        // +X face
        result = lineSegmentPlaneIntersection(a, b, this.xpos);
        if (result.count > 0) 
        {
            // if point lies within region face, triangle intersects region
            if (result.point.y >= this.min.y && result.point.y <= this.max.y &&
                result.point.z >= this.min.z && result.point.z <= this.max.z)
            {
                return true;
            }
        }

        // -X face
        result = lineSegmentPlaneIntersection(a, b, this.xneg);
        if (result.count > 0) 
        {
            if (result.point.y >= this.min.y && result.point.y <= this.max.y &&
                result.point.z >= this.min.z && result.point.z <= this.max.z)
            {
                return true;
            }
        }

        // +Y face
        result = lineSegmentPlaneIntersection(a, b, this.ypos);
        if (result.count > 0)
        {
            if (result.point.x >= this.min.x && result.point.x <= this.max.x &&
                result.point.z >= this.min.z && result.point.z <= this.max.z)
            {
                return true;
            }
        }

        // -Y face
        result = lineSegmentPlaneIntersection(a, b, this.yneg);
        if (result.count > 0)
        {
            if (result.point.x >= this.min.x && result.point.x <= this.max.x &&
                result.point.z >= this.min.z && result.point.z <= this.max.z)
            {
                return true;
            }
        }

        // +Z face
        result = lineSegmentPlaneIntersection(a, b, this.zpos);
        if (result.count > 0)
        {
            if (result.point.x >= this.min.x && result.point.x <= this.max.x &&
                result.point.y >= this.min.y && result.point.y <= this.max.y)
            {
                return true;
            }
        }

        // -Z face
        result = lineSegmentPlaneIntersection(a, b, this.zneg);
        if (result.count > 0)
        {
            if (result.point.x >= this.min.x && result.point.x <= this.max.x &&
                result.point.y >= this.min.y && result.point.y <= this.max.y)
            {
                return true;
            }
        }
    }
    
    // triangle and region may still intersect if a region corner is poking
    // through the interior of the triangle; check for this case by
    // determining if any of the four region diagonals intersect the triangle
    // 0
    result = lineSegmentTriangleIntersection(this.min, 
                                             this.max, 
                                             verts[0], verts[1], verts[2]);
    if (result.count > 0) return true;    
    // 1
    result = lineSegmentTriangleIntersection(new Vector3D(this.min.x, this.max.y, this.min.z), 
                                             new Vector3D(this.max.x, this.min.y, this.max.z),
                                             verts[0], verts[1], verts[2]);
    if (result.count > 0) return true;
    // 2
    result = lineSegmentTriangleIntersection(new Vector3D(this.max.x, this.min.y, this.min.z), 
                                             new Vector3D(this.min.x, this.max.y, this.max.z),
                                             verts[0], verts[1], verts[2]);
    if (result.count > 0) return true;
    // 3                                        
    result = lineSegmentTriangleIntersection(new Vector3D(this.min.x, this.min.y, this.max.z), 
                                             new Vector3D(this.max.x, this.max.y, this.min.z),
                                             verts[0], verts[1], verts[2]);
    if (result.count > 0) return true;

    // triangle and region do not intersect
    return false;
}

function SphereTreeNode()
{
    this.sphere = new Sphere();
    this.level = 0;
    this.parent = null;
    this.children = [];
    this.triIndices = [];    
}

SphereTreeNode.prototype.addChild = function(child)
{
    this.children.push(child);
    child.parent = this;
}

function BoundingTree()
{
    this.min = new Vector3D();
    this.max = new Vector3D();
    this.tris = [];
    this.visited = [];    
}

BoundingTree.prototype.setTriangles = function(tris, min, max)
{
    this.tris = tris.slice();
    this.min.copy(min);
    this.max.copy(max);
}

SphereTree.prototype = new BoundingTree();
SphereTree.prototype.constructor = SphereTree;

function SphereTree()
{
    BoundingTree.call(this);
    
    this.root = null;
}

SphereTree.prototype.rayIntersectsTree = function(params)
{
    if (this.root)
    {
        this.visited.length = this.tris.length;
        for (var i=0; i < this.visited.length; i++)
        {
            this.visited[i] = false;
        }

        return this.rayIntersectsTreeNode(this.root, params);
    }

    return false;
}

SphereTree.prototype.rayIntersectsTreeNode = function(root, params)
{
    // if this sphere tree node has children, and it is intersected by the ray, 
    // recurse on all sphere tree nodes in the next level, saving the smallest positive 
    // t value; if ray does not intersect this sphere tree node, or if no intersections 
    // are found for the next level, return false
    if (root.children.length > 0)
    {
        // check if this sphere tree node is intersected by the ray
        if (this.rayIntersectsSphere(root, params) == false)
        {
            return false;
        }

        // sphere tree node is intersected by the ray, recurse on children nodes
        var childIntersects = false;
        for (var i=0; i < root.children.length; i++)
        {
            if (this.rayIntersectsTreeNode(root.children[i], params) == true)
            {
                childIntersects = true;
            }
        }

        if (childIntersects)
        {
            return true;
        }
        else // !childIntersects
        {
            return false;
        }
    }
    else // root.children.empty()
    {   
        // lowest sphere tree node level (no children); check against tris
        return this.rayIntersectsTriangleList(root.triIndices, params);
    }
}

SphereTree.prototype.rayIntersectsSphere = function(node, params)
{
    // transform sphere center by world-view transform
    var center = params.worldViewMatrix.transform(node.sphere.center.x, node.sphere.center.y, node.sphere.center.z, 1);

    // adjust sphere radius by scale factor
    var radius = node.sphere.radius * params.scale;

    // test for ray-sphere intersection
    var roots = raySphereIntersection(params.rayOrigin, params.rayDir, center, radius);
    switch (roots.count)
    {
    case 2:
        // two intersection points; accept if one root is positive
        if (roots.root1 <= 0 && roots.root2 <= 0)
        {
            return false;
        }
        break;

    case 1:
        // one intersection point (ray grazes sphere); accept if root is positive
        if (roots.root1 <= 0)
        {
            return false;
        }
        break;

    case 0:
    default:
        // no intersection
        return false;
    }

    return true;
}

SphereTree.prototype.rayIntersectsTriangleList = function(triIndices, params)
{
    var distance, u, v;

    // determine closest triangle intersected by ray (closest to ray origin)
    for (var i=0; i < triIndices.length; i++)
    {
        var index = triIndices[i];

        // skip triangle if already tested
        if (this.visited[index] == true)
        {
            continue;
        }

        var tri = this.tris[index];

        // transform triangle vertices by world-view transform
        var v0 = params.worldViewMatrix.transform(tri.v0.x, tri.v0.y, tri.v0.z, 1);
        var v1 = params.worldViewMatrix.transform(tri.v1.x, tri.v1.y, tri.v1.z, 1);
        var v2 = params.worldViewMatrix.transform(tri.v2.x, tri.v2.y, tri.v2.z, 1);

        var result = rayTriangleIntersection(params.rayOrigin, params.rayDir, v0, v1, v2, false,
                                            (params.doubleSided ? false : true));
        if (result.result)
        {
            if (result.t >= params.nearDistance &&
                result.t <= params.farDistance && 
                result.t <  params.intersectRecord.distance)
            {
				var pointModel = new Vector3D(tri.v0.x * (1 - result.u - result.v) + tri.v1.x * result.u + tri.v2.x * result.v,
				                              tri.v0.y * (1 - result.u - result.v) + tri.v1.y * result.u + tri.v2.y * result.v,
				                              tri.v0.z * (1 - result.u - result.v) + tri.v1.z * result.u + tri.v2.z * result.v);				
				var pointWorld = params.worldMatrix.transform(pointModel.x, pointModel.y, pointModel.z, 1);
				var pointView = params.worldViewMatrix.transform(pointModel.x, pointModel.y, pointModel.z, 1);

				// test for intersection point on negative side of clip plane(s), if any (would hence be clipped)
				for (var c=0; c < params.clipPlanes.length; c++)
				{
					if (pointOnNegativeSideOfPlane(pointWorld, params.clipPlanes[c]))
					{
						// mark triangle as tested
						this.visited[index] = true;
						break;
					}
				}
				if (this.visited[index]) // clipped by clip plane(s)
				{
					continue;
				}

                params.intersectRecord.distance = result.t;
				params.intersectRecord.pointModel.copy(pointModel);
                params.intersectRecord.pointWorld.copy(pointWorld);
                params.intersectRecord.pointView.copy(pointView);
                params.intersectRecord.triIndex = index;
                params.intersects = true;
            }
        }

        // mark triangle as tested
        this.visited[index] = true;
    }
    
    return params.intersects;
}

Octree.prototype = new SphereTree();
Octree.prototype.constructor = Octree;

function Octree()
{
    SphereTree.call(this);
}

Octree.prototype.buildTree = function(levels)
{
    if (levels < 0) return;
    
    // define root sphere
    var root = new SphereTreeNode();
    
    // sphere center is the midpoint of min/max extents
    root.sphere.center.copy(midpoint(this.min, this.max));

    // sphere radius is the distance between the midpoint of min/max extents and min/max extent
    root.sphere.radius = distanceBetween(root.sphere.center, this.max);

    // set triIndices
    root.triIndices.length = this.tris.length;
    for (var i=0; i < this.tris.length; i++)
    {
        root.triIndices[i] = i;
    }

    // build subsequent levels (if requested) 
    if (levels > 0)
    {
        this.buildTreeLevels(levels, this.min, this.max, root, root.triIndices);
    }

    this.root = root;    
}

Octree.prototype.buildTreeLevels = function(levels, min, max, root, triIndices)
{
    if (root.level == levels)
    {
        // requested levels have been generated
        return;
    }
    
    // define 8 equal sub-regions occupying the span from min to max
    var mid = new Vector3D(min.x + ((max.x - min.x) / 2), 
                           min.y + ((max.y - min.y) / 2),
                           min.z + ((max.z - min.z) / 2));
                           
    var regions = new Array(8);
    regions[0] = new Region(min.x, min.y, min.z, mid.x, mid.y, mid.z);
    regions[1] = new Region(mid.x, min.y, min.z, max.x, mid.y, mid.z);
    regions[2] = new Region(min.x, min.y, mid.z, mid.x, mid.y, max.z);
    regions[3] = new Region(mid.x, min.y, mid.z, max.x, mid.y, max.z);
    regions[4] = new Region(min.x, mid.y, min.z, mid.x, max.y, mid.z);
    regions[5] = new Region(mid.x, mid.y, min.z, max.x, max.y, mid.z);
    regions[6] = new Region(min.x, mid.y, mid.z, mid.x, max.y, max.z);
    regions[7] = new Region(mid.x, mid.y, mid.z, max.x, max.y, max.z);
    
    // for each sub-region containing geometry, create a bounding sphere for the sub-region, 
    // add to the list of the root sphere node's children, and recursively call for the child 
    // sub-region
    for (var i=0; i < 8; i++)
    {
        var triIndicesContainedByRegion = regions[i].containsGeometry(this.tris, triIndices);
        if (triIndicesContainedByRegion.length > 0)
        {
            // create sphere node
            var node = new SphereTreeNode();
          
            // set level
            node.level = root.level + 1;

            // set center
            node.sphere.center.copy(midpoint(regions[i].min, regions[i].max));

            // set radius
            node.sphere.radius = distanceBetween(node.sphere.center, regions[i].max);

            // set triIndices
            node.triIndices = triIndicesContainedByRegion.slice();

            // add to root sphere node
            root.addChild(node);

            // recurse on sub-region
            this.buildTreeLevels(levels, regions[i].min, regions[i].max, node, node.triIndices);
        }
    }
}

function rayPick(tree,
                 rayOrigin, 
                 rayDir,
                 nearDistance,
                 farDistance,
                 worldMatrix,
                 viewMatrix,
                 scale,
                 doubleSided,
			     clipPlanes)
{
	var params = new RayIntersectParams(rayOrigin, rayDir, nearDistance, farDistance, worldMatrix, viewMatrix, scale, doubleSided, clipPlanes);
    tree.rayIntersectsTree(params);
    if (params.intersects == true)
    {
        return params.intersectRecord;
    }
    
    return null;
}
var eRenderContextMethod =
{
	Unknown									: 0,
	
	ApplyModelViewTransform    				: 1,
    ApplyProjectionTransform				: 2,
    Clear           						: 3,
    ClearColor								: 4,
    CreateVertexBuffer					    : 5,
    CreateTextureObject 					: 6,
    Disable     							: 7,
    Enable  								: 8,
    Enabled	    							: 9,
    EnableLight								: 10,
    EnableTextureStage						: 11,
    Finish  								: 12,
    GetEnabledLights						: 13,
    GetGlobalIllumination					: 14,
    GetLight            					: 15,
    GetMaxLightCount    					: 16,
    GetMaxTextureStages						: 17,
    PerspectiveMatrixLH						: 18,
    OrthographicMatrixLH					: 19,
    SetBlendFactor							: 20,
    SetEnabledLights						: 21,
    SetFrontMaterial						: 22,
    SetGlobalIllumination					: 23,
    SetLight 			                    : 24,
    SetTextureBlendFactor					: 25,
    SetTextureBlendOp						: 26,
    SetViewport						        : 27,
    VB_SetPrimitiveType                     : 28,
    VB_SetVertices                          : 29,
    VB_SetNormals                           : 30,
    VB_SetUVCoords                          : 31,
    VB_SetTextureStage                      : 32,
    VB_Draw                                 : 33,
    TO_SetImage                             : 34,
    TO_SetImageData                         : 35,
    TO_SetVideo                             : 36,
    SetMatrixMode							: 37,
    PushMatrix								: 38,
    PopMatrix								: 39,
    LoadMatrix								: 40,
    LeftMultMatrix							: 41,
    RightMultMatrix							: 42
}

function RenderContextMethodDesc(method, params)
{
	this.method = method;
	this.params = params;
}

function DisplayListObj(renderContext)
{
    this.renderContext = renderContext;
    this.displayList = [];	
}

DisplayListObj.prototype.record_begin = function()
{
    this.clear();
    this.renderContext.setDisplayList(this);    
}

DisplayListObj.prototype.record_end = function()
{
    this.renderContext.setDisplayList(null);    
}

DisplayListObj.prototype.play = function()
{
    for (var i=0; i < this.displayList.length; i++)
    {
        this.invokeMethod(this.displayList[i]);
    }    
}

DisplayListObj.prototype.addMethodDesc = function(desc)
{
    this.displayList.push(desc);    
}

DisplayListObj.prototype.clear = function()
{
    this.displayList = [];    
}

DisplayListObj.prototype.invokeMethod = function(desc)
{  
    switch (desc.method)
    {
        case eRenderContextMethod.ApplyModelViewTransform:
        {
            this.renderContext.applyModelViewTransform();    
        }   
        break;
        
        case eRenderContextMethod.ApplyProjectionTransform:
        {
            this.renderContext.applyProjectionTransform();
        }   
        break;
        
        case eRenderContextMethod.Clear:
        {
            return this.renderContext.clear();
        }
        break;
        
        case eRenderContextMethod.ClearColor:
        {
            this.renderContext.clearColor(desc.params[0], desc.params[1], desc.params[2], desc.params[3]);
        }
        break;
        
        case eRenderContextMethod.CreateVertexBuffer:
        {
            return this.renderContext.createVertexBuffer(desc.params[0]);            
        }
        break;
        
        case eRenderContextMethod.CreateTextureObject:
        {
            this.renderContext.createTextureObject();    
        }
        break;
        
        case eRenderContextMethod.Disable:
        {
            this.renderContext.disable(desc.params[0]);
        }
        break;
        
        case eRenderContextMethod.Enable:
        {
            this.renderContext.enable(desc.params[0]);    
        }
        break;
        
        case eRenderContextMethod.Enabled:
        {
            return this.renderContext.enabled(desc.params[0]);    
        }
        break;
        
        case eRenderContextMethod.EnableLight:
        {
            this.renderContext.enableLight(desc.params[0], desc.params[1]);    
        }
        break;
        
        case eRenderContextMethod.EnableTextureStage:
        {
            this.renderContext.enableTextureStage(desc.params[0], desc.params[1]);    
        }
        break;
        
        case eRenderContextMethod.Finish:
        {
            this.renderContext.finish();        
        }
        break;
        
        case eRenderContextMethod.GetEnabledLights:
        {
            return this.renderContext.getEnabledLights();    
        }
        break;
        
        case eRenderContextMethod.GetGlobalIllumination:
        {
            return this.renderContext.getGlobalIllumination();    
        }
        break;
        
        case eRenderContextMethod.GetLight:
        {
            return this.renderContext.getLight(desc.params[0]);   
        }
        break;
            
        case eRenderContextMethod.GetMaxLightCount:
        {
            return this.renderContext.getMaxLightCount();   
        }
        break;
        
        case eRenderContextMethod.getMaxTextureStages:
        {
            return this.renderContext.getMaxTextureStages();
        }
        break;
        
        case eRenderContextMethod.PerspectiveMatrixLH:
        {
            this.renderContext.perspectiveMatrixLH(desc.params[0], desc.params[1], desc.params[2],
                desc.params[3], desc.params[4], desc.params[5]);   
        }
        break;
        
        case eRenderContextMethod.OrthographicMatrixLH:
        {
            this.renderContext.orthographicMatrixLH(desc.params[0], desc.params[1], desc.params[2],
                desc.params[3], desc.params[4], desc.params[5]);
        }
        break;
        
        case eRenderContextMethod.SetBlendFactor:
        {
            this.renderContext.setBlendFactor(desc.params[0], desc.params[1]);
        }
        break;

        case eRenderContextMethod.SetEnabledLights:
        {
            this.renderContext.setEnabledLights(desc.params[0]);
        }
        break;
        
        case eRenderContextMethod.SetFrontMaterial:
        {
            this.renderContext.setFrontMaterial(desc.params[0]);    
        }
        break;
        
        case eRenderContextMethod.SetGlobalIllumination:
        {
            this.renderContext.setGlobalIllumination(desc.params[0]);    
        }
        break;
        
        case eRenderContextMethod.SetLight:
        {
            this.renderContext.setLight(desc.params[0], desc.params[1]);    
        }
        break;
        
        case eRenderContextMethod.SetTextureBlendFactor:
        {
            this.renderContext.setTextureBlendFactor(desc.params[0]);   
        }
        break;
        
        case eRenderContextMethod.SetTextureBlendOp:
        {
            this.renderContext.setTextureBlendOp(desc.params[0]);    
        }
        break;
        
        case eRenderContextMethod.SetViewport:
        {
            this.renderContext.setViewport(desc.params[0], desc.params[1], desc.params[2],
                desc.params[3]);    
        }
        break;
        
        case eRenderContextMethod.VB_SetPrimitiveType:
        {
            desc.params[0].setPrimitiveType(desc.params[1]);
        }
        break;
        
        case eRenderContextMethod.VB_SetVertices:
        {
            desc.params[0].setVertices(desc.params[1]);
        }
        break;
        
        case eRenderContextMethod.VB_SetNormals:
        {
            desc.params[0].setNormals(desc.params[1]);
        }
        break;
        
        case eRenderContextMethod.VB_SetUVCoords:
        {
            desc.params[0].setUVCoords(desc.params[1], desc.params[2]);
        }
        break;
        
        case eRenderContextMethod.VB_SetTextureStage:
        {
            desc.params[0].setTextureStage(desc.params[1], desc.params[2], desc.params[3],
                desc.params[4], desc.params[5], desc.params[6]);
        }
        break;
        
        case eRenderContextMethod.VB_Draw:
        {
            desc.params[0].draw();
        }
        break;
        
        case eRenderContextMethod.TO_SetImage:
        {
            desc.params[0].setImage(desc.params[1], desc.params[2], desc.params[3]);   
        }
        break;
        
        case eRenderContextMethod.TO_SetImageData:
        {
            desc.params[0].setImageData(desc.params[1], desc.params[2], desc.params[3], 
                desc.params[4], desc.params[5]);
        }
        break;
        
        case eRenderContextMethod.TO_SetVideo:
        {
            desc.params[0].setVideo(desc.params[1]);
        }
        break;
        
        case eRenderContextMethod.SetMatrixMode:
        {
        	this.renderContext.setMatrixMode(desc.params[0]);
        }
        break;
        
        case eRenderContextMethod.PushMatrix:
        {
        	this.renderContext.pushMatrix();
        }
        break;
        
        case eRenderContextMethod.PopMatrix:
        {
        	this.renderContext.popMatrix();
        }
        break;
        
        case eRenderContextMethod.LoadMatrix:
        {
        	this.renderContext.loadMatrix(desc.params[0]);
        }
        break;
        
        case eRenderContextMethod.LeftMultMatrix:
        {
        	this.renderContext.leftMultMatrix(desc.params[0]);
        }
        break;
        
        case eRenderContextMethod.RightMultMatrix:
        {
        	this.renderContext.rightMultMatrix(desc.params[0]);
        }
        break;
    }
}

function DL_ADD_METHOD_DESC(dlObj, method, params)
{
    if (dlObj)
    {
        dlObj.addMethodDesc(new RenderContextMethodDesc(method, params));
    }    
}

/* 
 * enable caps 
 */
var eRenderMode =
{
    AlphaBlend              : 1,
    CullBackFace            : 2,
    DepthTest               : 3,
    DepthBufferWrite        : 4,
    Lighting                : 5,
    NormalizeNormals        : 6,
    Fog                     : 7,
    StencilTest             : 8,
    PolygonOffset_Fill      : 9,
    PolygonOffset_Line      : 10,
    PolygonOffset_Point     : 11
}
 
var RC_BLEND            = 0x0001;
var RC_CULL_FACE        = 0x0B44;

/*
 * light desc
 */
var LIGHTDESC_POSITION_BIT          = 0x001;
var LIGHTDESC_DIRECTION_BIT         = 0x002;
var LIGHTDESC_AMBIENT_BIT           = 0x004;
var LIGHTDESC_DIFFUSE_BIT           = 0x008;
var LIGHTDESC_SPECULAR_BIT          = 0x010;
var LIGHTDESC_CONSTANT_ATT_BIT      = 0x020;
var LIGHTDESC_LINEAR_ATT_BIT        = 0x040;
var LIGHTDESC_QUADRATIC_ATT_BIT     = 0x080;
var LIGHTDESC_RANGE_BIT             = 0x100;
var LIGHTDESC_OUTER_CONE_DEG_BIT    = 0x200;
var LIGHTDESC_INNER_CONE_DEG_BIT    = 0x400;
var LIGHTDESC_CONE_FALLOFF_BIT      = 0x800;

function LightDesc()
{
    this.type = "";                     // required: "directional", "point", "spot"
    this.validMembersMask = 0;
    this.position = new Vector3D();     // point, spot
    this.direction = new Vector3D();    // directional, spot
    this.ambient = new Color();         // all types
    this.diffuse = new Color();         // all types
    this.specular = new Color();        // all types
    this.constantAttenuation = 0;       // all types
    this.linearAttenuation = 0;         // all types
    this.quadraticAttenuation = 0;      // all types
    this.range = 0;                     // point, spot
    this.outerConeDegrees = 0;          // spot
    this.innerConeDegrees = 0;          // spot
    this.coneFalloff = 0;               // spot
}

/* 
 * material desc 
 */
var MATERIALDESC_AMBIENT_BIT        = 0x001;
var MATERIALDESC_DIFFUSE_BIT        = 0x002;
var MATERIALDESC_SPECULAR_BIT       = 0x004;
var MATERIALDESC_EMISSIVE_BIT       = 0x008;
var MATERIALDESC_GLOSSINESS_BIT     = 0x010;
var MATERIALDESC_ALL_BITS           = 0x01F;

function MaterialDesc()
{
    this.validMembersMask = 0;
    this.ambient = new Color();
    this.diffuse = new Color();
    this.specular = new Color();
    this.emissive = new Color();
    this.glossiness = 0;

    this.copy = function(materialDesc)
    {
        if (materialDesc)
        {
            this.validMembersMask = materialDesc.validMembersMask;
            this.ambient.copy(materialDesc.ambient);
            this.diffuse.copy(materialDesc.diffuse);
            this.specular.copy(materialDesc.specular);
            this.emissive.copy(materialDesc.emissive);
            this.glossiness = materialDesc.glossiness;
        }
    }
}

/*
 * blend factor
 */
var RC_ZERO                         = 0x001;    
var RC_ONE                          = 0x002;
var RC_SRC_COLOR                    = 0x004;
var RC_SRC_ALPHA                    = 0x008;
var RC_ONE_MINUS_SRC_COLOR          = 0x010;
var RC_ONE_MINUS_SRC_ALPHA          = 0x020;
var RC_DEST_COLOR                   = 0x040;
var RC_DEST_ALPHA                   = 0x080;
var RC_ONE_MINUS_DEST_COLOR         = 0x100;
var RC_ONE_MINUS_DEST_ALPHA         = 0x200;

/*
 * blend op
 */
var RC_MODULATE                     = 0x001;
var RC_REPLACE                      = 0x002;
var RC_BLEND                        = 0x004;
var RC_DECAL                        = 0x008;

/*
 * texture coordinate source
 */
var eTextureCoordSrc = 
{
    VertexUVs                       : 1,
    ViewSpaceVertexPosition         : 2,
    ViewSpaceReflectionVector       : 3
}
 
/*
 * texture wrap
 */
var RC_REPEAT                      = 0x2901;
var RC_CLAMP_TO_EDGE               = 0x812F;
var RC_MIRRORED_REPEAT             = 0x8370;

/*
 * matrix mode
 */
var RC_MODELVIEW				   = 0x001;
var RC_PROJECTION				   = 0x002;
var RC_TEXTURE					   = 0x004;

/*
 * render context
 */
function RenderContext(canvas, background)
{
    this.valid = false;
    
    this.canvas = canvas;
    this.background = background;
    
    this.projectionMatrixStack = new MatrixStack(new Matrix4x4());
    this.modelViewMatrixStack = new MatrixStack(new Matrix4x4());
    this.matrixMode = RC_MODELVIEW;
    
    this.frontMaterial = new MaterialDesc();
    
    this.displayListObj = null;
    
    this.getDisplayList = function()
    {
        return this.displayListObj;    
    }
    
    this.setDisplayList = function(displayListObj)
    {
        this.displayListObj = displayListObj;
    }
    
    this.getFrontMaterial = function()
    {
        var material = new MaterialDesc();
        material.copy(this.frontMaterial); 
        return material;             
    }

    this.setBackgroundImage = function(url, width, height)
    {
        if (this.background)
        {
            this.background.src = url;
            this.background.width = width;
            this.background.height = height;
        }
    }
    
    this.setMatrixMode = function(mode) 
    { 
    	if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.SetMatrixMode, [mode]);
    	
    	this.matrixMode = mode; 
    }
    
    this.pushMatrix = function()
    {
    	if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.PushMatrix, null);
    	
    	switch (this.matrixMode)
    	{
    		case RC_MODELVIEW:
    		{
    			this.modelViewMatrixStack.push();
    		}
    		break;
    		
    		case RC_PROJECTION:
    		{
    			this.projectionMatrixStack.push();
    		}
    		break;
    	}	
    }
    
    this.popMatrix = function()
    {
    	if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.PopMatrix, null);
    	
    	switch (this.matrixMode)
    	{
    		case RC_MODELVIEW:
    		{
    			this.modelViewMatrixStack.pop();
    		}
    		break;
    		
    		case RC_PROJECTION:
    		{
    			this.projectionMatrixStack.pop();
    		}
    		break;
    	}
    }
    
    this.loadMatrix = function(matrix)
    {
    	if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.LoadMatrix, [matrix]);
    	
    	switch (this.matrixMode)
    	{
    		case RC_MODELVIEW:
    		{
    			this.modelViewMatrixStack.loadMatrix(matrix);
    		}
    		break;
    		
    		case RC_PROJECTION:
    		{
    			this.projectionMatrixStack.loadMatrix(matrix);
    		}
    		break;
    	}	
    }
    
    this.leftMultMatrix = function(matrix)
    {
    	if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.LeftMultMatrix, [matrix]);
    	
    	switch (this.matrixMode)
    	{
    		case RC_MODELVIEW:
    		{
    			this.modelViewMatrixStack.leftMultiply(matrix);
    		}
    		break;
    		
    		case RC_PROJECTION:
    		{
    			this.projectionMatrixStack.leftMultiply(matrix);
    		}
    		break;
    	}
    }
    
    this.rightMultMatrix = function(matrix)
    {
    	if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.RightMultMatrix, [matrix]);
    	
    	switch (this.matrixMode)
    	{
    		case RC_MODELVIEW:
    		{
    			this.modelViewMatrixStack.rightMultiply(matrix);
    		}
    		break;
    		
    		case RC_PROJECTION:
    		{
    			this.projectionMatrixStack.rightMultiply(matrix);
    		}
    		break;
    	}	
    }
}

function newRenderContext(api, canvas, background)
{
    var rc = null;
    
    switch (api)
    {
    case "webgl":
        {
            rc = new webglRC(canvas, background);
        }
        break;
    }

    // return rc if valid    
    return rc.valid ? rc : null;
}

var RENDERSTATE_TRANSFORM_BIT      = 0x001;
var RENDERSTATE_LIGHTING_BIT       = 0x002;
var RENDERSTATE_MATERIAL_BIT       = 0x004;
var RENDERSTATE_FOG_BIT            = 0x008;
var RENDERSTATE_CLIP_PLANE_BIT     = 0x010;
var RENDERSTATE_ZBUFFER_BIT		   = 0x020;
var RENDERSTATE_ALL_BITS           = 0x03F;

function RenderStateRec()
{
    this.projMatrix = new Matrix4x4();
    this.worldViewMatrix = new Matrix4x4();
    // TODO: textureMatrices
    this.lightIndices = [];
    this.lightStates = [];
    this.lightMatrices = [];
    this.lightingEnabled = false;
    this.materialDesc = new MaterialDesc();
    // TODO: fogParams
    this.fogEnabled = false;
    this.clipPlaneIndices = [];
    this.clipPlanes = [];
    this.clipPlaneMatrices = [];
    this.zBufferEnabled = false;
    this.zBufferWriteEnabled = false;
}

function RenderState(rc)
{
    this.renderContext = rc;

    this.stateStack = new Stack();
    
    this.push = function(mask)
    {
        var rec = this.getState(mask);
        this.stateStack.push(rec);
    }

    this.pop = function(mask)
    {
        if (this.stateStack.empty()) return;

        var rec = this.stateStack.top();
        this.setState(mask, rec);
        this.stateStack.pop();
    }

    this.getState = function(mask)
    {
        var rec = new RenderStateRec();

        if (mask & RENDERSTATE_TRANSFORM_BIT)
        {
            rec.projMatrix = this.renderContext.projectionMatrixStack.top();
            rec.worldViewMatrix = this.renderContext.modelViewMatrixStack.top();
        }

        if (mask & RENDERSTATE_LIGHTING_BIT)
        {
            rec.lightIndices = this.renderContext.getEnabledLights();
            for (var i = 0; i < rec.lightIndices.length; i++)
            {
                var light = this.renderContext.getLight(rec.lightIndices[i]);
                rec.lightStates[i] = light.desc;
                rec.lightMatrices[i] = light.matrix;
            }
            rec.lightingEnabled = this.renderContext.enabled(eRenderMode.Lighting);
        }

        if (mask & RENDERSTATE_MATERIAL_BIT)
        {
            rec.materialDesc = this.renderContext.getFrontMaterial();
        }

        if (mask & RENDERSTATE_FOG_BIT)
        {
        }

        if (mask & RENDERSTATE_CLIP_PLANE_BIT)
        {
        }

        if (mask & RENDERSTATE_ZBUFFER_BIT)
        {
            rec.zBufferEnabled = this.renderContext.enabled(eRenderMode.depthTest);
            rec.zBufferWriteEnabled = this.renderContext.enabled(eRenderMode.depthBufferWrite);
        }

        return rec;
    }

    this.setState = function(mask, rec)
    {
        if (mask & RENDERSTATE_TRANSFORM_BIT)
        {
            this.renderContext.projectionMatrixStack.loadMatrix(rec.projMatrix);
            this.renderContext.applyProjectionTransform();
            this.renderContext.modelViewMatrixStack.loadMatrix(rec.worldViewMatrix);
            this.renderContext.applyModelViewTransform();
        }

        if (mask & RENDERSTATE_LIGHTING_BIT)
        {
            // set light state for each set light within this state block
            for (var i = 0; i < rec.lightIndices.length; i++)
            {
                this.renderContext.modelViewMatrixStack.push(rec.lightMatrices[i]);
                this.renderContext.setLight(rec.lightIndices[i], rec.lightStates[i]);
                this.renderContext.modelViewMatrixStack.pop();
            }

            // set light state to disabled for lights set outside this state block
            this.renderContext.setEnabledLights(rec.lightIndices);

            // set current lighting enabled
            if (rec.lightingEnabled)
            {
                this.renderContext.enable(eRenderMode.Lighting);
            }
            else
            {
                this.renderContext.disable(eRenderMode.Lighting);
            }
        }

        if (mask & RENDERSTATE_MATERIAL_BIT)
        {
            this.renderContext.setFrontMaterial(rec.materialDesc);
        }

        if (mask & RENDERSTATE_FOG_BIT)
        {
        }

        if (mask & RENDERSTATE_CLIP_PLANE_BIT)
        {
        }

        if (mask & RENDERSTATE_ZBUFFER_BIT)
        {
            if (rec.zBufferEnabled)
            {
                this.renderContext.enable(eRenderMode.depthTest);
            }
            else
            {
                this.renderContext.disable(eRenderMode.depthTest);
            }

            if (rec.zBufferWriteEnabled)
            {
                this.renderContext.enable(eRenderMode.depthBufferWrite);
            }
            else
            {
                this.renderContext.disable(eRenderMode.depthBufferWrite);
            }
        }
    }
}
var RC_POINTS                       = 0x0000;
var RC_LINES                        = 0x0001;
var RC_LINE_LOOP                    = 0x0002;
var RC_LINE_STRIP                   = 0x0003;
var RC_TRIANGLES                    = 0x0004;
var RC_TRIANGLE_STRIP               = 0x0005;
var RC_TRIANGLE_FAN                 = 0x0006;
    
function VertexBuffer()
{
    this.vertices = new Array();
    this.normals = new Array();
    this.vertexCount = 0;
    this.numVerticesPerPrimitive = 0;
}
function TextureObject()
{
}
//Copyright (c) 2009 The Chromium Authors. All rights reserved.
//Use of this source code is governed by a BSD-style license that can be
//found in the LICENSE file.

// Various functions for helping debug WebGL apps.

WebGLDebugUtils = function() {

/**
 * Wrapped logging function.
 * @param {string} msg Message to log.
 */
var log = function(msg) {
  if (window.console && window.console.log) {
    window.console.log(msg);
  }
};

/**
 * Which arguements are enums.
 * @type {!Object.<number, string>}
 */
var glValidEnumContexts = {

  // Generic setters and getters

  'enable': { 0:true },
  'disable': { 0:true },
  'getParameter': { 0:true },

  // Rendering

  'drawArrays': { 0:true },
  'drawElements': { 0:true, 2:true },

  // Shaders

  'createShader': { 0:true },
  'getShaderParameter': { 1:true },
  'getProgramParameter': { 1:true },

  // Vertex attributes

  'getVertexAttrib': { 1:true },
  'vertexAttribPointer': { 2:true },

  // Textures

  'bindTexture': { 0:true },
  'activeTexture': { 0:true },
  'getTexParameter': { 0:true, 1:true },
  'texParameterf': { 0:true, 1:true },
  'texParameteri': { 0:true, 1:true, 2:true },
  'texImage2D': { 0:true, 2:true, 6:true, 7:true },
  'texSubImage2D': { 0:true, 6:true, 7:true },
  'copyTexImage2D': { 0:true, 2:true },
  'copyTexSubImage2D': { 0:true },
  'generateMipmap': { 0:true },

  // Buffer objects

  'bindBuffer': { 0:true },
  'bufferData': { 0:true, 2:true },
  'bufferSubData': { 0:true },
  'getBufferParameter': { 0:true, 1:true },

  // Renderbuffers and framebuffers

  'pixelStorei': { 0:true, 1:true },
  'readPixels': { 4:true, 5:true },
  'bindRenderbuffer': { 0:true },
  'bindFramebuffer': { 0:true },
  'checkFramebufferStatus': { 0:true },
  'framebufferRenderbuffer': { 0:true, 1:true, 2:true },
  'framebufferTexture2D': { 0:true, 1:true, 2:true },
  'getFramebufferAttachmentParameter': { 0:true, 1:true, 2:true },
  'getRenderbufferParameter': { 0:true, 1:true },
  'renderbufferStorage': { 0:true, 1:true },

  // Frame buffer operations (clear, blend, depth test, stencil)

  'clear': { 0:true },
  'depthFunc': { 0:true },
  'blendFunc': { 0:true, 1:true },
  'blendFuncSeparate': { 0:true, 1:true, 2:true, 3:true },
  'blendEquation': { 0:true },
  'blendEquationSeparate': { 0:true, 1:true },
  'stencilFunc': { 0:true },
  'stencilFuncSeparate': { 0:true, 1:true },
  'stencilMaskSeparate': { 0:true },
  'stencilOp': { 0:true, 1:true, 2:true },
  'stencilOpSeparate': { 0:true, 1:true, 2:true, 3:true },

  // Culling

  'cullFace': { 0:true },
  'frontFace': { 0:true },
};

/**
 * Map of numbers to names.
 * @type {Object}
 */
var glEnums = null;

/**
 * Initializes this module. Safe to call more than once.
 * @param {!WebGLRenderingContext} ctx A WebGL context. If
 *    you have more than one context it doesn't matter which one
 *    you pass in, it is only used to pull out constants.
 */
function init(ctx) {
  if (glEnums == null) {
    glEnums = { };
    for (var propertyName in ctx) {
      if (typeof ctx[propertyName] == 'number') {
        glEnums[ctx[propertyName]] = propertyName;
      }
    }
  }
}

/**
 * Checks the utils have been initialized.
 */
function checkInit() {
  if (glEnums == null) {
    throw 'WebGLDebugUtils.init(ctx) not called';
  }
}

/**
 * Returns true or false if value matches any WebGL enum
 * @param {*} value Value to check if it might be an enum.
 * @return {boolean} True if value matches one of the WebGL defined enums
 */
function mightBeEnum(value) {
  checkInit();
  return (glEnums[value] !== undefined);
}

/**
 * Gets an string version of an WebGL enum.
 *
 * Example:
 *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
 *
 * @param {number} value Value to return an enum for
 * @return {string} The string version of the enum.
 */
function glEnumToString(value) {
  checkInit();
  var name = glEnums[value];
  return (name !== undefined) ? name :
      ("*UNKNOWN WebGL ENUM");// (0x" + value.toString(16) + ")");
}

/**
 * Returns the string version of a WebGL argument.
 * Attempts to convert enum arguments to strings.
 * @param {string} functionName the name of the WebGL function.
 * @param {number} argumentIndx the index of the argument.
 * @param {*} value The value of the argument.
 * @return {string} The value as a string.
 */ 
function glFunctionArgToString(functionName, argumentIndex, value) {
  var funcInfo = glValidEnumContexts[functionName];
  if (funcInfo !== undefined) {
    if (funcInfo[argumentIndex]) {
      return glEnumToString(value);
    }
  }
  return value.toString();
}

/**
 * Given a WebGL context returns a wrapped context that calls
 * gl.getError after every command and calls a function if the
 * result is not gl.NO_ERROR.
 *
 * @param {!WebGLRenderingContext} ctx The webgl context to
 *        wrap.
 * @param {!function(err, funcName, args): void} opt_onErrorFunc
 *        The function to call when gl.getError returns an
 *        error. If not specified the default function calls
 *        console.log with a message.
 */
function makeDebugContext(ctx, opt_onErrorFunc) {
  init(ctx);
  opt_onErrorFunc = opt_onErrorFunc || function(err, functionName, args) {
        // apparently we can't do args.join(",");
        var argStr = "";
        for (var ii = 0; ii < args.length; ++ii) {
          argStr += ((ii == 0) ? '' : ', ') + 
              glFunctionArgToString(functionName, ii, args[ii]);
        }
        log("WebGL error "+ glEnumToString(err) + " in "+ functionName +
            "(" + argStr + ")");
      };

  // Holds booleans for each GL error so after we get the error ourselves
  // we can still return it to the client app.
  var glErrorShadow = { };

  // Makes a function that calls a WebGL function and then calls getError.
  function makeErrorWrapper(ctx, functionName) {
    return function() {
      var result = ctx[functionName].apply(ctx, arguments);
      var err = ctx.getError();
      if (err != 0) {
        glErrorShadow[err] = true;
        opt_onErrorFunc(err, functionName, arguments);
      }
      return result;
    };
  }

  // Make a an object that has a copy of every property of the WebGL context
  // but wraps all functions.
  var wrapper = {};
  for (var propertyName in ctx) {
    if (typeof ctx[propertyName] == 'function') {
      wrapper[propertyName] = makeErrorWrapper(ctx, propertyName);
     } else {
       wrapper[propertyName] = ctx[propertyName];
     }
  }

  // Override the getError function with one that returns our saved results.
  wrapper.getError = function() {
    for (var err in glErrorShadow) {
      if (glErrorShadow[err]) {
        glErrorShadow[err] = false;
        return err;
      }
    }
    return ctx.NO_ERROR;
  };

  return wrapper;
}

return {
  /**
   * Initializes this module. Safe to call more than once.
   * @param {!WebGLRenderingContext} ctx A WebGL context. If
   *    you have more than one context it doesn't matter which one
   *    you pass in, it is only used to pull out constants.
   */
  'init': init,

  /**
   * Returns true or false if value matches any WebGL enum
   * @param {*} value Value to check if it might be an enum.
   * @return {boolean} True if value matches one of the WebGL defined enums
   */
  'mightBeEnum': mightBeEnum,

  /**
   * Gets an string version of an WebGL enum.
   *
   * Example:
   *   WebGLDebugUtil.init(ctx);
   *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
   *
   * @param {number} value Value to return an enum for
   * @return {string} The string version of the enum.
   */
  'glEnumToString': glEnumToString,

  /**
   * Converts the argument of a WebGL function to a string.
   * Attempts to convert enum arguments to strings.
   *
   * Example:
   *   WebGLDebugUtil.init(ctx);
   *   var str = WebGLDebugUtil.glFunctionArgToString('bindTexture', 0, gl.TEXTURE_2D);
   *   
   * would return 'TEXTURE_2D'
   *
   * @param {string} functionName the name of the WebGL function.
   * @param {number} argumentIndx the index of the argument.
   * @param {*} value The value of the argument.
   * @return {string} The value as a string.
   */
  'glFunctionArgToString': glFunctionArgToString,

  /**
   * Given a WebGL context returns a wrapped context that calls
   * gl.getError after every command and calls a function if the
   * result is not NO_ERROR.
   *
   * You can supply your own function if you want. For example, if you'd like
   * an exception thrown on any GL error you could do this
   *
   *    function throwOnGLError(err, funcName, args) {
   *      throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to" +
   *            funcName;
   *    };
   *
   *    ctx = WebGLDebugUtils.makeDebugContext(
   *        canvas.getContext("webgl"), throwOnGLError);
   *
   * @param {!WebGLRenderingContext} ctx The webgl context to wrap.
   * @param {!function(err, funcName, args): void} opt_onErrorFunc The function
   *     to call when gl.getError returns an error. If not specified the default
   *     function calls console.log with a message.
   */
  'makeDebugContext': makeDebugContext
};

}();


function gl_LightSourceParameters()
{
    var enabled;
    var ambient;
    var diffuse;
    var specular;
    var position;
    var spotDirection;
    var spotExponent;
    var spotCutoff;
    var constantAttenuation;
    var linearAttenuation;
    var quadraticAttenuation;
}

var gl_MaxLights = 8;

function gl_MaterialParameters()
{
    var ambient;
    var diffuse;
    var specular;
    var emission;
    var shininess; 
}

var gl_MaxTextureStages = 2;

webglRC.prototype = new RenderContext();
webglRC.prototype.constructor = webglRC;

function webglRC(canvas, background)
{
    //
    // initialization
    //
    
    RenderContext.call(this, canvas, background);
    
    var gl = getWebGLContext(canvas, false /*set to true for debug context*/);
    if (!gl) return;

    gl.clearColor(0, 0, 0, background ? 0 : 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.frontFace(gl.CW);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
   
    // create shaders
    var shaders = getShaders(gl, eShaderType.VertexLighting);
    if (!shaders.vertex || !shaders.fragment) return;

    // create program
    var program = getProgram(gl, shaders.vertex, shaders.fragment);
    if (!program) return;

    // set valid flag
    this.valid = true;

    // misc private members
    var vLightDescs = [];
    var vLightMatrices = [];
    var vLightEnabledStates = [];
    
    //
    // methods
    //
    
    this.applyModelViewTransform = function()
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.ApplyModelViewTransform, null);
        
        gl.uniformMatrix4fv(program.modelViewMatrix, false, new Float32Array(this.modelViewMatrixStack.top().flatten()));

        var normalMatrix = new Matrix4x4();
        normalMatrix.loadMatrix(this.modelViewMatrixStack.top());
        normalMatrix.invert();
        normalMatrix.transpose();
        gl.uniformMatrix4fv(program.normalMatrix, false, new Float32Array(normalMatrix.flatten()));
    }
    
    this.applyProjectionTransform = function()
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.ApplyProjectionTransform, null);
        
        gl.uniformMatrix4fv(program.projectionMatrix, false, new Float32Array(this.projectionMatrixStack.top().flatten()));
    }
    
    this.clear = function()
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.Clear, null);
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);// | gl.STENCIL_BUFFER_BIT);
    }

    this.clearColor = function(r, g, b, a)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.ClearColor, [r, g, b, a]);
        
        gl.clearColor(r, g, b, a);
    }
    
    this.createVertexBuffer = function(numVerticesPerPrimitive)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.CreateVertexBuffer, [numVerticesPerPrimitive]);
        
        return new webglVB(this, gl, program, numVerticesPerPrimitive);
    }
    
    this.createTextureObject = function()
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.CreateTextureObject, null);
        
        return new webglTO(this, gl, program);
    }

    this.disable = function(cap)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.Disable, [cap]);
        
        switch (cap)
        {
            case eRenderMode.AlphaBlend:
                gl.disable(gl.BLEND);
                break;

            case eRenderMode.CullBackFace:
                gl.disable(gl.CULL_FACE);
                break;

            case eRenderMode.DepthBufferWrite:
                gl.depthMask(false);
                break;

            case eRenderMode.DepthTest:
                gl.disable(gl.DEPTH_TEST);
                break;

            case eRenderMode.Lighting:
                gl.uniform1i(program.lightingEnabled, false); 
                break;
        }
    }

    this.enable = function(cap)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.Enable, [cap]);
        
        switch (cap)
        {
            case eRenderMode.AlphaBlend:
                gl.enable(gl.BLEND);
                break;

            case eRenderMode.CullBackFace:
                gl.enable(gl.CULL_FACE);
                break;

            case eRenderMode.DepthBufferWrite:
                gl.depthMask(true);
                break;

            case eRenderMode.DepthTest:
                gl.enable(gl.DEPTH_TEST);
                break;

            case eRenderMode.Lighting:
                gl.uniform1i(program.lightingEnabled, true);
                break;
        }
    }

    this.enabled = function(cap)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.Enabled, [cap]);
        
        var e = false;

        switch (cap)
        {
            case eRenderMode.AlphaBlend:
                e = gl.getParameter(gl.BLEND);
                break;

            case eRenderMode.CullBackFace:
                e = gl.getParameter(gl.CULL_FACE);
                break;
                
            case eRenderMode.DepthBufferWrite:
                e = gl.getParameter(gl.DEPTH_WRITEMASK);
                break;

            case eRenderMode.DepthTest:
                e = gl.getParameter(gl.DEPTH_TEST);
                break;

            case eRenderMode.Lighting:
                e = gl.getUniform(program, program.lightingEnabled);
                break;
        }

        return e;
    }

    this.enableLight = function(index, enable)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.EnableLight, [index, enable]);
        
        gl.uniform1i(program.lightSource[index].enabled, enable);

        vLightEnabledStates[index] = enable;
    }
    
    this.enableTextureStage = function(stage, enable)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.EnableTextureStage, [stage, enable]);
        
        gl.uniform1i(program.textureStageEnabled[stage], enable);
    }
    
    this.finish = function()
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.Finish, null);
        
        gl.finish();
    }

    this.getEnabledLights = function()
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.GetEnabledLights, null);
        
        var indices = [];

        for (var i = 0; i < vLightEnabledStates.length; i++)
        {
            if (vLightEnabledStates[i])
            {
                indices.push(i);
            }
        }

        return indices;
    }

    this.getGlobalIllumination = function()
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.GetGlobalIllumination, null);
        
        var values = gl.getUniform(program, program.globalAmbientLight);

        return { r: values[0], g: values[1], b: values[2], a: values[3] };
    }
    
    this.getLight = function(index)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.GetLight, [index]);
        
        return { desc: vLightDescs[index], matrix: vLightMatrices[index] };
    }
    
    this.getMaxLightCount = function()
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.GetMaxLightCount, null);
        
        return gl_MaxLights;
    }
    
    this.getMaxTextureStages = function()
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.GetMaxTextureStages, null);
        
        return gl_MaxTextureStages;
    }
    
    this.perspectiveMatrixLH = function(left, right, top, bottom, near, far)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.PerspectiveMatrixLH, [left, right, top, bottom, near, far]);
        
        var p = new Matrix4x4();
        
        var a = (right + left) / (right - left);
        var b = (top + bottom) / (top - bottom);
        var c = (far + near) / (far - near);
        var d = (2 * far * near) / (far - near);
        
        p._11 = (2 * near) / (right - left);
        p._13 = a;
        p._22 = (2 * near) / (top - bottom);
        p._23 = b;
        p._33 = c;
        p._34 = 1;
        p._43 = -d;
        p._44 = 0;
        
        return p;
    }
    
    this.orthographicMatrixLH = function(left, right, top, bottom, near, far)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.OrthographicMatrixLH, [left, right, top, bottom, near, far]);
        
        var p = new Matrix4x4();
        
        p._11 =  2 / (right - left);
        p._22 =  2 / (top - bottom);
        p._33 = -2 / (far - near);
        p._41 = -((right + left) / (right - left));
        p._42 = -((top + bottom) / (top - bottom));
        p._43 = -((far + near) / (far - near)) / 2;
              
        return p;
    }
    
    this.setBlendFactor = function(sfactor, dfactor)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.SetBlendFactor, [sfactor, dfactor]);
        
        var gl_SrcFactor;
        switch (sfactor)
        {
        case RC_ZERO:                   gl_SrcFactor = gl.ZERO; break;
        case RC_ONE:                    gl_SrcFactor = gl.ONE; break;
        case RC_SRC_COLOR:              gl_SrcFactor = gl.SRC_COLOR; break;
        case RC_SRC_ALPHA:              gl_SrcFactor = gl.SRC_ALPHA; break;        
        case RC_ONE_MINUS_SRC_COLOR:    gl_SrcFactor = gl.ONE_MINUS_SRC_COLOR; break;
        case RC_ONE_MINUS_SRC_ALPHA:    gl_SrcFactor = gl.ONE_MINUS_SRC_ALPHA; break;
        case RC_DEST_COLOR:             gl_SrcFactor = gl.DEST_COLOR; break;
        case RC_DEST_ALPHA:             gl_SrcFactor = gl.DEST_ALPHA; break;        
        case RC_ONE_MINUS_DEST_COLOR:   gl_SrcFactor = gl.ONE_MINUS_DEST_COLOR; break;
        case RC_ONE_MINUS_DEST_ALPHA:   gl_SrcFactor = gl.ONE_MINUS_DEST_ALPHA; break;
        }     
        
        var gl_DestFactor;
        switch (dfactor)
        {
        case RC_ZERO:                   gl_DestFactor = gl.ZERO; break;
        case RC_ONE:                    gl_DestFactor = gl.ONE; break;
        case RC_SRC_COLOR:              gl_DestFactor = gl.SRC_COLOR; break;
        case RC_SRC_ALPHA:              gl_DestFactor = gl.SRC_ALPHA; break;        
        case RC_ONE_MINUS_SRC_COLOR:    gl_DestFactor = gl.ONE_MINUS_SRC_COLOR; break;
        case RC_ONE_MINUS_SRC_ALPHA:    gl_DestFactor = gl.ONE_MINUS_SRC_ALPHA; break;
        case RC_DEST_COLOR:             gl_DestFactor = gl.DEST_COLOR; break;
        case RC_DEST_ALPHA:             gl_DestFactor = gl.DEST_ALPHA; break;        
        case RC_ONE_MINUS_DEST_COLOR:   gl_DestFactor = gl.ONE_MINUS_DEST_COLOR; break;
        case RC_ONE_MINUS_DEST_ALPHA:   gl_DestFactor = gl.ONE_MINUS_DEST_ALPHA; break;
        }
        
        gl.blendFunc(gl_SrcFactor, gl_DestFactor);  
    }

    this.setEnabledLights = function(indices)
    {
        if (this.displayListObj) if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.SetEnabledLights, [indices]);
        
        // disable all previously enabled lights
        for (var i = 0; i < vLightEnabledStates.length; i++)
        {
            if (vLightEnabledStates[i])
            {
                this.enableLight(i, false);
            }
        }

        // enable specified lights
        for (var i = 0; i < indices.length; i++)
        {
            this.enableLight(indices[i], true);
        }
    }
    
    this.setFrontMaterial = function(desc)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.SetFrontMaterial, [desc]);
        
        // ambient
        if (desc.validMembersMask & MATERIALDESC_AMBIENT_BIT)
        {
            gl.uniform4fv(program.frontMaterial.ambient, new Float32Array(desc.ambient.v()));
            
            this.frontMaterial.ambient = desc.ambient;
        }
        
        // diffuse
        if (desc.validMembersMask & MATERIALDESC_DIFFUSE_BIT)
        {
            gl.uniform4fv(program.frontMaterial.diffuse, new Float32Array(desc.diffuse.v()));
            
            this.frontMaterial.diffuse = desc.diffuse;
        }
        
        // specular
        if (desc.validMembersMask & MATERIALDESC_SPECULAR_BIT)
        {
            gl.uniform4fv(program.frontMaterial.specular, new Float32Array(desc.specular.v()));
            
            this.frontMaterial.specular = desc.specular;
        }
        
        // emissive
        if (desc.validMembersMask & MATERIALDESC_EMISSIVE_BIT)
        {
            // TODO
            //gl.uniform4fv(program.frontMaterial.emission, new Float32Array(desc.emissive.v()));
            
            this.frontMaterial.emissive = desc.emissive;
        }
        
        // glossiness
        if (desc.validMembersMask & MATERIALDESC_GLOSSINESS_BIT)
        {
            // glossiness - OpenGL accepts values in the range [0, 128].
            // use the range [5, 128], because values below 5 result in wash-out
            gl.uniform1f(program.frontMaterial.shininess, clamp(desc.glossiness * 128, 5, 128));
            
            this.frontMaterial.glossiness = desc.glossiness;
        }
        
        this.frontMaterial.validMembersMask |= desc.validMembersMask;
    }

    this.setGlobalIllumination = function(ambient)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.SetGlobalIllumination, [ambient]);
        
        var values = [ ambient.r, ambient.g, ambient.g, ambient.a ];

        gl.uniform4fv(program.globalAmbientLight, new Float32Array(values));
    }

    this.setLight = function(index, desc)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.SetLight, [index, desc]);
        
        // get current modelView transform
        var modelViewMatrix = this.modelViewMatrixStack.top();

        // position
        if (desc.validMembersMask & LIGHTDESC_POSITION_BIT)
        {
            // transform to view space
            var position = modelViewMatrix.transformw(desc.position.x, desc.position.y, desc.position.z, 1);
            var values = [position.x, position.y, position.z, position.w];
            gl.uniform4fv(program.lightSource[index].position, new Float32Array(values));
        }

        // direction
        if (desc.validMembersMask & LIGHTDESC_DIRECTION_BIT)
        {
            // transform to view space
            var direction = modelViewMatrix.transform(desc.direction.x, desc.direction.y, desc.direction.z, 0);
            var values = [direction.x, direction.y, direction.z, 0];

            switch (desc.type)
            {
                case "directional":
                    {
                        values[0] *= -1;
                        values[1] *= -1;
                        values[2] *= -1;

                        // OpenGL gets a directional light's direction from position member                
                        gl.uniform4fv(program.lightSource[index].position, new Float32Array(values));
                    }
                    break;

                case "spot":
                    {
                        gl.uniform4fv(program.lightSource[index].spotDirection, new Float32Array(values));
                    }
                    break;
            }
        }

        // ambient
        if (desc.validMembersMask & LIGHTDESC_AMBIENT_BIT)
        {
            gl.uniform4fv(program.lightSource[index].ambient, new Float32Array(desc.ambient.v()));
        }

        // diffuse
        if (desc.validMembersMask & LIGHTDESC_DIFFUSE_BIT)
        {
            gl.uniform4fv(program.lightSource[index].diffuse, new Float32Array(desc.diffuse.v()));
        }

        // specular
        if (desc.validMembersMask & LIGHTDESC_SPECULAR_BIT)
        {
            gl.uniform4fv(program.lightSource[index].specular, new Float32Array(desc.specular.v()));
        }

        // constant attenuation
        if (desc.validMembersMask & LIGHTDESC_CONSTANT_ATT_BIT)
        {
            gl.uniform1f(program.lightSource[index].constantAttenuation, desc.constantAttenuation);
        }

        // linear attenuation
        if (desc.validMembersMask & LIGHTDESC_LINEAR_ATT_BIT)
        {
            gl.uniform1f(program.lightSource[index].linearAttenuation, desc.linearAttenuation);
        }

        // quadratic attenuation
        if (desc.validMembersMask & LIGHTDESC_QUADRATIC_ATT_BIT)
        {
            gl.uniform1f(program.lightSource[index].quadraticAttenuation, desc.quadraticAttenuation);
        }

        // range
        if (desc.validMembersMask & LIGHTDESC_RANGE_BIT)
        {
            // TODO
            //gl.uniform1f(program.lightSource[index].range, desc.range);
        }

        // outer cone angle
        if (desc.validMembersMask & LIGHTDESC_OUTER_CONE_DEG_BIT)
        {
            var outerConeDegrees = desc.outerConeDegrees;

            // OpenGL accepts cone degrees in the range [0, 90] or 180
            if (outerConeDegrees > 90)
            {
                outerConeDegrees = 180;
            }

            gl.uniform1f(program.lightSource[index].spotCutoff, outerConeDegrees);

            gl.uniform1f(program.lightSource[index].spotExponent, 0);
        }

        // inner cone angle
        if (desc.validMembersMask & LIGHTDESC_INNER_CONE_DEG_BIT)
        {
            // TODO
        }

        // cone falloff
        if (desc.validMembersMask & LIGHTDESC_CONE_FALLOFF_BIT)
        {
            // TODO
        }

        vLightDescs[index] = desc;
        vLightMatrices[index] = modelViewMatrix;
    }

    this.setTextureBlendFactor = function(factor)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.SetTextureBlendFactor, [factor]);
        
        // update material diffuse component alpha to blend factor
        var diffuse = [ this.frontMaterial.diffuse.r, this.frontMaterial.diffuse.g, this.frontMaterial.diffuse.b, factor ];
        gl.uniform4fv(program.frontMaterial.diffuse, new Float32Array(diffuse));
    }
    
    this.setTextureBlendOp = function(op)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.SetTextureBlendOp, [op]);
        
        gl.uniform1i(program.textureBlendOp, op);
    }

    this.setViewport = function(x, y, width, height)
    {
        if (this.displayListObj) DL_ADD_METHOD_DESC(this.displayListObj, eRenderContextMethod.SetViewport, [x, y, width, height]);
        
        gl.viewport(x, y, width, height);
    }
}

function getWebGLContext(canvas, debug) 
{
    var gl = null;
    try 
    {
        if (debug)
        {
            gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("experimental-webgl", {antialias : false}));
        }
        else // !debug
        {
            gl = canvas.getContext("experimental-webgl", {antialias : true});
        }
    }    
    catch (e) 
    {
    }
    if (!gl) 
    {
        var div = document.createElement("div");
        div.innerHTML = "This demo requires a WebGL-enabled browser.";
        var canvasParent = canvas.parentNode;
        canvasParent.replaceChild(div, canvas);
    }

    return gl;
}

function getProgram(gl, vShader, fShader)
{
    var program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        alert(gl.getProgramInfoLog(program));
        return null;
    }
    
    gl.useProgram(program);
    
    // get attributes
    program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(program.vertexPositionAttribute);
    program.vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
    gl.enableVertexAttribArray(program.vertexNormalAttribute);
    program.textureCoordAttribute = new Array(gl_MaxTextureStages);
    for (var i=0; i < gl_MaxTextureStages; i++)
    {
        program.textureCoordAttribute[i] = gl.getAttribLocation(program, "aTextureCoord" + i);
        gl.enableVertexAttribArray(program.textureCoordAttribute[i]);
    }
    
    // get uniforms
    
    // matrices
    program.projectionMatrix = gl.getUniformLocation(program, "uProjectionMatrix");
    program.modelViewMatrix = gl.getUniformLocation(program, "uModelViewMatrix");
    program.normalMatrix = gl.getUniformLocation(program, "uNormalMatrix");

    // lights
    program.globalAmbientLight = gl.getUniformLocation(program, "uGlobalAmbientLight");
    program.lightSource = new Array(gl_MaxLights);
    for (var i=0; i < gl_MaxLights; i++)
    {
        program.lightSource[i] = new gl_LightSourceParameters();
      
        program.lightSource[i].enabled = gl.getUniformLocation(program, "uLightSource_enabled[" + i + "]");
        program.lightSource[i].ambient = gl.getUniformLocation(program, "uLightSource_ambient[" + i + "]"); 
        program.lightSource[i].diffuse = gl.getUniformLocation(program, "uLightSource_diffuse[" + i + "]");
        program.lightSource[i].specular = gl.getUniformLocation(program, "uLightSource_specular[" + i + "]");
        program.lightSource[i].position = gl.getUniformLocation(program, "uLightSource_position[" + i + "]");
        program.lightSource[i].spotDirection = gl.getUniformLocation(program, "uLightSource_spotDirection[" + i + "]");
        program.lightSource[i].spotExponent = gl.getUniformLocation(program, "uLightSource_spotExponent[" + i + "]");
        program.lightSource[i].spotCutoff = gl.getUniformLocation(program, "uLightSource_spotCutoff[" + i + "]");
        program.lightSource[i].constantAttenuation = gl.getUniformLocation(program, "uLightSource_constantAttenuation[" + i + "]");
        program.lightSource[i].linearAttenuation = gl.getUniformLocation(program, "uLightSource_linearAttenuation[" + i + "]");
        program.lightSource[i].quadraticAttenuation = gl.getUniformLocation(program, "uLightSource_quadraticAttenuation[" + i + "]");
        
        // set initially disabled
        gl.uniform1i(program.lightSource[i].enabled, 0);
    }
    
    // materials
    program.frontMaterial = new gl_MaterialParameters();
    program.frontMaterial.ambient = gl.getUniformLocation(program, "uFrontMaterial_ambient");
    program.frontMaterial.diffuse = gl.getUniformLocation(program, "uFrontMaterial_diffuse");
    program.frontMaterial.specular = gl.getUniformLocation(program, "uFrontMaterial_specular");
    program.frontMaterial.emission = gl.getUniformLocation(program, "uFrontMaterial_emission");
    program.frontMaterial.shininess = gl.getUniformLocation(program, "uFrontMaterial_shininess");
     
    // textures
    program.textureSamplerColor = new Array(gl_MaxTextureStages);
    program.textureSamplerAlpha = new Array(gl_MaxTextureStages);
    program.textureStageEnabled = new Array(gl_MaxTextureStages)
    for (var i=0; i < gl_MaxTextureStages; i++)
    {
        program.textureSamplerColor[i] = gl.getUniformLocation(program, "uTextureSamplerColor[" + i + "]");
        program.textureSamplerAlpha[i] = gl.getUniformLocation(program, "uTextureSamplerAlpha[" + i + "]");
        program.textureStageEnabled[i] = gl.getUniformLocation(program, "uTextureStageEnabled[" + i + "]");
    }
    program.textureBlendOp = gl.getUniformLocation(program, "uTextureBlendOp");
    
    // enabled
    program.lightingEnabled = gl.getUniformLocation(program, "uLightingEnabled");
    program.texturesEnabled = gl.getUniformLocation(program, "uTexturesEnabled");
    
    // set initially enabled/disabled
    gl.uniform1i(program.lightingEnabled, 1);
    gl.uniform1i(program.texturesEnabled, 1); 
    gl.uniform1i(program.textureStageEnabled[0], 0); 
    gl.uniform1i(program.textureStageEnabled[1], 0);
    
    return program;
}

function webglVB_uvb(buffer, coords)
{
    this.buffer = buffer;
    this.coords = coords;
}

webglVB.prototype = new VertexBuffer();
webglVB.prototype.constructor = webglVB;

function webglVB(rc, gl, program, numVerticesPerPrimitive)
{
    //
    // initialization
    //
    
    VertexBuffer.call(this);
    
    this.numVerticesPerPrimitive = numVerticesPerPrimitive;
    
    var rc = rc;
    var gl = gl;
    var program = program;
    var vb = gl.createBuffer();
    var nb = null;
    var uvb = new Array(gl_MaxTextureStages);
    var uvEmpty = gl.createBuffer(); // for VBs with no texture coordinates (see below)
    var uvCoords = []; // indexed by texture
    var primitiveType = 0;
    
    //
    // methods
    //
    
    this.setPrimitiveType = function(type)
    {
        if (rc.displayListObj) DL_ADD_METHOD_DESC(rc.displayListObj, eRenderContextMethod.VB_SetPrimitiveType, [this, type]);
        
        switch (type)
        {
        case RC_POINTS:         primitiveType = gl.POINTS; break;
        case RC_LINES:          primitiveType = gl.LINES; break;
        case RC_LINE_LOOP:      primitiveType = gl.LINE_LOOP; break;
        case RC_LINE_STRIP:     primitiveType = gl.LINE_STRIP; break;
        case RC_TRIANGLES:      primitiveType = gl.TRIANGLES; break;
        case RC_TRIANGLE_STRIP: primitiveType = gl.TRIANGLE_STRIP; break;
        case RC_TRIANGLE_FAN:   primitiveType = gl.TRIANGLE_FAN; break;
        }
    }
    
    this.setVertices = function(vertices)
    {
        if (rc.displayListObj) DL_ADD_METHOD_DESC(rc.displayListObj, eRenderContextMethod.VB_SetVertices, [this, vertices]);
        
        if (vertices.length)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, vb);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            
            this.vertexCount = vertices.length / this.numVerticesPerPrimitive;
            
            // create empty texture coordinate arrays for vb's with no textures (see below)
            gl.bindBuffer(gl.ARRAY_BUFFER, uvEmpty);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(new Array(this.vertexCount * 2)), gl.STATIC_DRAW);           
        }
        
        this.vertices = vertices;
    }
    
    this.setNormals = function(normals)
    {
        if (rc.displayListObj) DL_ADD_METHOD_DESC(rc.displayListObj, eRenderContextMethod.VB_SetNormals, [this, normals]);
        
        if (normals.length)
        {
            if (nb == null)
            {
                nb = gl.createBuffer();
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, nb);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        }
        
        this.normals = normals;
    }

    this.setUVCoords = function(texture, coords)
    {
        if (rc.displayListObj) DL_ADD_METHOD_DESC(rc.displayListObj, eRenderContextMethod.VB_SetUVCoords, [this, texture, coords]);
        
        uvCoords[texture] = new webglVB_uvb(gl.createBuffer(), coords.slice());

        // flip y
        for (var i = 1; i < uvCoords[texture].coords.length; i += 2)
        {
            uvCoords[texture].coords[i] = 1 - uvCoords[texture].coords[i];
        }
    }
    
    this.setTextureStage = function(stage, textureObj, widthWrap, heightWrap, textureCoordSrc, planeCoefficients)
    {
        if (rc.displayListObj) DL_ADD_METHOD_DESC(rc.displayListObj, eRenderContextMethod.VB_SetTextureStage, [this, stage, textureObj, widthWrap, heightWrap, textureCoordSrc, planeCoefficients]);
        
        switch (stage)
        {
        case 0: gl.activeTexture(gl.TEXTURE0); break;       
        case 1: gl.activeTexture(gl.TEXTURE1); break;
        }

        gl.bindTexture(gl.TEXTURE_2D, textureObj.texture);
        gl.uniform1i(program.textureSamplerColor[stage], stage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, widthWrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, heightWrap);
                
        if (uvCoords[textureObj])
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, uvCoords[textureObj].buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvCoords[textureObj].coords), gl.STATIC_DRAW);  
            uvb[stage] = uvCoords[textureObj].buffer;
        }            
    }
    
    this.draw = function()
    {
        if (rc.displayListObj) DL_ADD_METHOD_DESC(rc.displayListObj, eRenderContextMethod.VB_Draw, [this]);

        if (this.vertices.length)
        {
            // vertices
            gl.bindBuffer(gl.ARRAY_BUFFER, vb);
            gl.vertexAttribPointer(program.vertexPositionAttribute, this.numVerticesPerPrimitive, gl.FLOAT, false, 0, 0);

            // normals
            if (nb != null)
            {
                gl.bindBuffer(gl.ARRAY_BUFFER, nb);
                gl.vertexAttribPointer(program.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
            }
            
            // texture coords
            // NOTE: vertex shader silently fails if nothing is specified for a given program attribute, so if 
            // no texture coords are specified, use the vertex uv buffer.
            for (var i=0; i < gl_MaxTextureStages; i++)
            {
                if (uvb[i]) 
                    gl.bindBuffer(gl.ARRAY_BUFFER, uvb[i]);
                else 
                    gl.bindBuffer(gl.ARRAY_BUFFER, uvEmpty);
                gl.vertexAttribPointer(program.textureCoordAttribute[i], 2, gl.FLOAT, false, 0, 0);
            }
  
            gl.drawArrays(primitiveType, 0, this.vertexCount);
        }
    }
}
webglTO.prototype = new TextureObject();
webglTO.prototype.constructor = webglTO;

function webglTO(rc, gl, program)
{
    //
    // initialization
    //
    
    TextureObject.call(this);
    
    var rc = rc;
    var gl = gl;
    var program = program;
    
    this.texture = gl.createTexture();
    
    //
    // methods
    //

    this.setImage = function(image, pixelFormat, imageFormat)
    {
        if (rc.displayListObj) DL_ADD_METHOD_DESC(rc.displayListObj, eRenderContextMethod.TO_SetImage, [this, image, pixelFormat, imageFormat]);

        var intFormat;
        switch (pixelFormat)
        {
            case ePixelFormat.R8G8B8:
            case ePixelFormat.B8G8R8:
            case ePixelFormat.X8G8R8:
                intFormat = gl.RGB;
                break;

            case ePixelFormat.R8G8B8A8:
            case ePixelFormat.B8G8R8A8:
            case ePixelFormat.A8R8G8B8:
            case ePixelFormat.A8B8G8R8:
            case ePixelFormat.X8X8X8X8:
                intFormat = gl.RGBA;
                break;

            case ePixelFormat.A8:
                intFormat = gl.ALPHA;
                break;

            default: // unsupported format
                return;
                break;
        }

        var format;
        switch (imageFormat)
        {
            case eImageFormat.RGB:
                format = gl.RGB;
                break;

            case eImageFormat.RGBA:
                format = gl.RGBA;
                break;

            case eImageFormat.Alpha:
                format = gl.ALPHA;
                break;

            case eImageFormat.Luminance:
                format = gl.LUMINANCE;
                break;

            case eImageFormat.Luminance_Alpha:
                format = gl.LUMINANCE_ALPHA;
                break;

            default: // unsupported format
                return;
                break;
        }

        // following taken from:
        // http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences
        if (!isPowerOfTwo(image.width) || !isPowerOfTwo(image.height))
        {
            // Scale up the texture to the next highest power of two dimensions.
            var canvas = document.createElement("canvas");
            canvas.width = nextHighestPowerOfTwo(image.width);
            canvas.height = nextHighestPowerOfTwo(image.height);
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image,
                0, 0, image.width, image.height,
                0, 0, canvas.width, canvas.height);
            image = canvas;
        }

        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.texImage2D(gl.TEXTURE_2D, 0, intFormat, format, gl.UNSIGNED_BYTE, image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    this.setImageData = function(width, height, pixelFormat, imageFormat, pixels)
    {
        if (rc.displayListObj) DL_ADD_METHOD_DESC(rc.displayListObj, eRenderContextMethod.TO_SetImageData, [this, width, height, pixelFormat, imageFormat, pixels]);

        var intFormat;
        switch (pixelFormat)
        {
            case ePixelFormat.R8G8B8:
            case ePixelFormat.B8G8R8:
            case ePixelFormat.X8G8R8:
                intFormat = gl.RGB;
                break;

            case ePixelFormat.R8G8B8A8:
            case ePixelFormat.B8G8R8A8:
            case ePixelFormat.A8R8G8B8:
            case ePixelFormat.A8B8G8R8:
            case ePixelFormat.X8X8X8X8:
                intFormat = gl.RGBA;
                break;

            case ePixelFormat.A8:
                intFormat = gl.ALPHA;
                break;

            default: // unsupported format
                return;
                break;
        }

        var format;
        switch (imageFormat)
        {
            case eImageFormat.RGB:
                format = gl.RGB;
                break;

            case eImageFormat.RGBA:
                format = gl.RGBA;
                break;

            case eImageFormat.Alpha:
                format = gl.ALPHA;
                break;

            case eImageFormat.Luminance:
                format = gl.LUMINANCE;
                break;

            case eImageFormat.Luminance_Alpha:
                format = gl.LUMINANCE_ALPHA;
                break;

            default: // unsupported format
                return;
                break;
        }
        
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.texImage2D(gl.TEXTURE_2D, 0, intFormat, width, height, 0, format, gl.UNSIGNED_BYTE,
            new Uint8Array(pixels));

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    	
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    this.setVideo = function(video)
    {
        if (rc.displayListObj) DL_ADD_METHOD_DESC(rc.displayListObj, eRenderContextMethod.TO_SetVideo, [this, video]);

        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // different browsers require calls to different versions of texImage2D; possibly because 
        // complete webGL implementations are not yet available
        switch (getBrowserName())
        {
            case "Chrome":
            //gl.texImage2D(gl.TEXTURE_2D, 0, video, false);
            //break;

            case "Firefox":
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
                break;

            default:
                gl.texImage2D(gl.TEXTURE_2D, 0, video, false);
                break;
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

function isPowerOfTwo(x)
{
    return (x & (x - 1)) == 0;
}

function nextHighestPowerOfTwo(x)
{
    --x;
    for (var i = 1; i < 32; i <<= 1)
    {
        x = x | x >> i;
    }
    return x + 1;
}
var eShaderType =
{
    VertexLighting: 0,
    FragmentLighting: 1
};

function getShaders(gl, type)
{
    var source_vs = null;
    var source_fs = null;
    
    switch (type)
    {
        case eShaderType.VertexLighting:
            {
                source_vs = [
                    "#ifdef GL_ES",
                    "precision highp float;",
                    "#endif",
                    "",
                    "vec4 gAmbient;",
                    "vec4 gDiffuse;",
                    "vec4 gSpecular;",
                    "",
                    "attribute vec3 aVertexPosition;",
                    "attribute vec3 aVertexNormal;",
                    "attribute vec2 aTextureCoord0;",   // attributes cannot be arrays and must be specified
                    "attribute vec2 aTextureCoord1;",   // attributes cannot be arrays and must be specified      
                    "", 
                    "uniform mat4 uProjectionMatrix;",
                    "uniform mat4 uModelViewMatrix;",
                    "uniform mat4 uNormalMatrix;",
                    "",
                    "uniform vec4 uGlobalAmbientLight;",
                    "",
                    "uniform int uLightSource_enabled[" + gl_MaxLights + "];",
                    "uniform vec4 uLightSource_ambient["  + gl_MaxLights + "];",
                    "uniform vec4 uLightSource_diffuse["  + gl_MaxLights + "];",
                    "uniform vec4 uLightSource_specular["  + gl_MaxLights + "];",
                    "uniform vec4 uLightSource_position["  + gl_MaxLights + "];",
                    "uniform vec4 uLightSource_halfVector["  + gl_MaxLights + "];",
                    "uniform vec4 uLightSource_spotDirection["  + gl_MaxLights + "];",
                    "uniform float uLightSource_spotExponent["  + gl_MaxLights + "];",
                    "uniform float uLightSource_spotCutoff["  + gl_MaxLights + "];",
                    "uniform float uLightSource_spotCosCutoff["  + gl_MaxLights + "];",
                    "uniform float uLightSource_constantAttenuation["  + gl_MaxLights + "];",
                    "uniform float uLightSource_linearAttenuation["  + gl_MaxLights + "];",
                    "uniform float uLightSource_quadraticAttenuation["  + gl_MaxLights + "];",
                    "",
                    "uniform vec4 uFrontMaterial_ambient;",
                    "uniform vec4 uFrontMaterial_diffuse;",
                    "uniform vec4 uFrontMaterial_specular;",
                    "uniform vec4 uFrontMaterial_emission;",
                    "uniform float uFrontMaterial_shininess;",
                    "",
                    "uniform int uLightingEnabled;",
                    "",
                    "varying vec4 vLightingFactor;",
                    "varying vec2 vTextureCoord[" + gl_MaxTextureStages + "];",
                    "",
                    "void directionalLight(vec4 position, vec4 ambient, vec4 diffuse, vec4 specular, vec3 normal, vec3 halfVector)",
                    "{",
                    "   vec3 lightDir;",
                    "   float nDotL;",      // normal . light direction
                    "   float nDotHV;",     // normal . half-vector
                    "   float pf;",         // power factor
                    "",
                    "   lightDir = normalize(vec3(position));",
                    "",	
                    "   nDotL = max(dot(normal, lightDir), 0.0);",
                    "   if (nDotL == 0.0)",
                    "   {",
                    "       pf = 0.0;",
                    "   }",
                    "   else",
                    "   {",
                    "       nDotHV = max(0.0, dot(normal, halfVector));",
                    "       pf = pow(nDotHV, uFrontMaterial_shininess);",
                    "   }",
                    "",
                    "   gAmbient  += ambient * uFrontMaterial_ambient;",
                    "   gDiffuse  += diffuse * uFrontMaterial_diffuse * nDotL;",
                    "   gSpecular += specular * uFrontMaterial_specular * pf;",
                    "}",
                    "",
                    "void pointLight(vec4 position, float constantAttenuation, float linearAttenuation, float quadraticAttenuation,",
                    "                vec4 ambient, vec4 diffuse, vec4 specular, vec3 normal, vec3 eye, vec3 vPosition)",
                    "{",
                    "   float nDotL;",      // normal . light direction
                    "   float nDotHV;",     // normal . light half vector
                    "   float pf;",         // power factor
                    "   float attenuation;",// computed attenuation factor
                    "   float d;",          // distance from surface to light source
                    "   vec3  L;",          // direction from surface to light position
                    "   vec3  halfVector;", //
                    "",
                    "", // Compute vector from surface to light position
                    "   L = vec3(position) - vPosition;",
                    "",
                    "", // Compute distance between surface and light position
                    "   d = length(L);",
                    "",
                    "", // Normalize the vector from surface to light position,
                    "   L = normalize(L);",
                    "",
                    "", // Compute attenuation,
                    "   attenuation = 1.0 / (constantAttenuation +",
                    "      linearAttenuation * d +",
                    "      quadraticAttenuation * d * d);",
                    "",
                    "   nDotL = max(0.0, dot(normal, L));",
                    "   nDotHV = max(0.0, dot(normal, normalize(L + eye)));",
                    "",
                    "   if (nDotL == 0.0)",
                    "   {",
                    "       pf = 0.0;",
                    "   }",
                    "   else",
                    "   {",
                    "       pf = pow(nDotHV, uFrontMaterial_shininess);",
                    "   }",
                    "",    
                    "   gAmbient  += ambient * uFrontMaterial_ambient * attenuation;",
                    "   gDiffuse  += diffuse * uFrontMaterial_diffuse * nDotL * attenuation;",
                    "   gSpecular += specular * uFrontMaterial_specular * pf * attenuation;",
                    "}",
                    "",
                    "void main()",
                    "{",
                    "   vec4 vertexPosition;",
                    "   vec4 transformedNormal;",
                    "   vec4 viewPosition;",
                    "   vec4 viewDirection;",
                    "",
                    "   if (uLightingEnabled != 0)",
                    "   {",
                    "       vertexPosition = uModelViewMatrix * vec4(aVertexPosition, 1);",
                    "       transformedNormal = normalize(uNormalMatrix * vec4(aVertexNormal, 0));",
                    "       viewPosition = uModelViewMatrix * vec4(0, 0, 0, 1);",
                    "       viewDirection = normalize(-viewPosition);",
                    
                    "       gAmbient = vec4(0, 0, 0, 0);",
                    "       gDiffuse = vec4(0, 0, 0, 0);",
                    "       gSpecular = vec4(0, 0, 0, 0);",
                    "",
                    "       for (int i=0; i < " + gl_MaxLights + "; i++)",
                    "       {",
                    "           if (uLightSource_enabled[i] != 0)",
                    "           {",
                    "               if (uLightSource_position[i][3] == 0.0)", // directional light
                    "               {",
                    "                   directionalLight(uLightSource_position[i], uLightSource_ambient[i],",
                    "                       uLightSource_diffuse[i], uLightSource_specular[i],",
                    "                       normalize(vec3(transformedNormal)),",
                    "                       normalize(vec3(viewDirection) + vec3(uLightSource_position[i])));",
                    "               }",
                    "               else if (uLightSource_spotCutoff[i] > 90.0)", // point light
                    "               {",
                    "                   pointLight(uLightSource_position[i], uLightSource_constantAttenuation[i],",
                    "                       uLightSource_linearAttenuation[i], uLightSource_quadraticAttenuation[i],",
                    "                       uLightSource_ambient[i], uLightSource_diffuse[i], uLightSource_specular[i],",
                    "                       normalize(vec3(transformedNormal)),",
                    "                       vec3(viewDirection), vec3(vertexPosition));",
                    "               }",
                    "               else", // spotlight
                    "               {",
                    "               }",   
                    "           }",
                    "       }",
                    "",
                    "       vLightingFactor  = uGlobalAmbientLight * uFrontMaterial_ambient;", // global ambient contribution
                    "       vLightingFactor += gAmbient + gDiffuse + gSpecular;", // light contribution(s)
                    "       vLightingFactor.a = uFrontMaterial_ambient.a / 3.0 + ",
                    "                           uFrontMaterial_diffuse.a / 3.0 + ",
                    "                           uFrontMaterial_specular.a / 3.0;",
                    "   }",
                    "   else", // uLightingEnabled == 0
                    "   {",
                    "",     // TODO: use vertex color
                    "       vLightingFactor = vec4(1, 1, 1, 1);",
                    "   }",
                    "",
                    "   vTextureCoord[0] = aTextureCoord0;",
                    "   vTextureCoord[1] = aTextureCoord1;",        
                    "   gl_Position = uProjectionMatrix * vertexPosition;",
                    "}"
                    ].join("\n");
                    
                source_fs = [
                    "#ifdef GL_ES",
                    "precision highp float;",
                    "#endif",
                    "",
                    "uniform int uTexturesEnabled;",
                    "uniform int uTextureStageEnabled[" + gl_MaxTextureStages + "];",       
                    "uniform sampler2D uTextureSamplerColor[" + gl_MaxTextureStages + "];",
                    "uniform sampler2D uTextureSamplerAlpha[" + gl_MaxTextureStages + "];",
                    "uniform int uTextureBlendOp;",
                    "",
                    "varying vec4 vLightingFactor;",
                    "varying vec2 vTextureCoord[" + gl_MaxTextureStages + "];",
                    "",
                    "void main()",
                    "{",
                    "   vec4 fragmentColor;",
                    "   vec4 fragmentColor1;",
                    "   vec4 fragmentColor2;",
                    "   if (uTexturesEnabled == 1 && uTextureStageEnabled[0] == 1 && uTextureStageEnabled[1] == 0)",
                    "   {",
                    "       fragmentColor = texture2D(uTextureSamplerColor[0], vec2(vTextureCoord[0].s, vTextureCoord[0].t));",
                    "       if (uTextureBlendOp == " + RC_MODULATE + ")",
                    "       {",
                    "           if (fragmentColor.a == 0.0) discard;",
                    "           else gl_FragColor = fragmentColor * vLightingFactor;",
                    "       }",
                    "       else if (uTextureBlendOp == " + RC_REPLACE + ")",
                    "       {",
                    "           gl_FragColor = fragmentColor;",
                    "       }",
                    "       else",
                    "       {",
                    "           fragmentColor = vec4(1, 1, 1, 1);",
                    "           gl_FragColor = fragmentColor * vLightingFactor;",
                    "       }",
                    "   }",
                    "   else if (uTexturesEnabled == 1 && uTextureStageEnabled[0] == 1 && uTextureStageEnabled[1] == 1)",
                    "   {",
                    "       fragmentColor1 = texture2D(uTextureSamplerColor[0], vec2(vTextureCoord[0].s, vTextureCoord[0].t));",
                    "       fragmentColor2 = texture2D(uTextureSamplerColor[1], vec2(vTextureCoord[1].s, vTextureCoord[1].t));",
                    "       if (uTextureBlendOp == " + RC_MODULATE + ")",
                    "       {",
                    "           fragmentColor1.a = fragmentColor2.a;",
                    "           if (fragmentColor1.a == 0.0) discard;",
                    "           else gl_FragColor = fragmentColor1 * vLightingFactor;",
                    "       }",
                    "       else if (uTextureBlendOp == " + RC_REPLACE + ")",
                    "       {",
                    "           gl_FragColor = fragmentColor1 * fragmentColor2;",
                    "       }",
                    "       else",
                    "       {",
                    "           fragmentColor = vec4(1, 1, 1, 1);",
                    "           gl_FragColor = fragmentColor * vLightingFactor;",
                    "       }",
                    "   }",
                    "   else", // uTexturesEnabled == 0
                    "   {",
                    "       fragmentColor = vec4(1, 1, 1, 1);",
                    "       gl_FragColor = fragmentColor * vLightingFactor;",
                    "   }",
                    "}"
                    ].join("\n");
            }
            break;
            
        case eShaderType.FragmentLighting:
            {
                source_vs = [
                    "attribute vec3 aVertexPosition;",
                    "attribute vec3 aVertexNormal;",
                    "attribute vec2 aTextureCoord0;",   // attributes cannot be arrays and must be specified
                    "attribute vec2 aTextureCoord1;",   // attributes cannot be arrays and must be specified      
                    "", 
                    "uniform mat4 uProjectionMatrix;",
                    "uniform mat4 uModelViewMatrix;",
                    "uniform mat4 uNormalMatrix;",
                    "",
                    "varying vec4 vVertexPosition;",
                    "varying vec4 vTransformedNormal;",
                    "varying vec4 vViewPosition;",
                    "varying vec4 vViewDirection;",
                    "varying vec2 vTextureCoord[" + gl_MaxTextureStages + "];",
                    "",
                    "void main()",
                    "{",
                    "   vVertexPosition = uModelViewMatrix * vec4(aVertexPosition, 1);",
                    "   vTransformedNormal = normalize(uNormalMatrix * vec4(aVertexNormal, 0));",
                    "   vViewPosition = uModelViewMatrix * vec4(0, 0, 0, 1);",
                    "   vViewDirection = normalize(-vViewPosition);",
                    "   vTextureCoord[0] = aTextureCoord0;",
                    "   vTextureCoord[1] = aTextureCoord1;",        
                    "   gl_Position = uProjectionMatrix * vVertexPosition;",
                    "}"
                    ].join("\n");
                
                source_fs = [
                    "#ifdef GL_ES",
                    "precision highp float;",
                    "#endif",
                    "",
                    "vec4 gAmbient;",
                    "vec4 gDiffuse;",
                    "vec4 gSpecular;",
                    "",
                    "uniform vec4 uGlobalAmbientLight;",
                    "",
            //        IE 11 doesn't currently support structs
            //        "struct lightSourceParameters",
            //        "{",
            //        "   int enabled;",
            //        "   vec4 ambient;",
            //        "   vec4 diffuse;",
            //        "   vec4 specular;",
            //        "   vec4 position;",
            //        "   vec4 halfVector;",
            //        "   vec4 spotDirection;",
            //        "   float spotExponent;",
            //        "   float spotCutoff;",
            //        "   float spotCosCutoff;",
            //        "   float constantAttenuation;",
            //        "   float linearAttenuation;",
            //        "   float quadraticAttenuation;",
            //        "};",
            //        "",
            //        "uniform lightSourceParameters uLightSource[" + gl_MaxLights + "];",
                    "",
                    "uniform int uLightSource_enabled[" + gl_MaxLights + "];",
                    "uniform vec4 uLightSource_ambient["  + gl_MaxLights + "];",
                    "uniform vec4 uLightSource_diffuse["  + gl_MaxLights + "];",
                    "uniform vec4 uLightSource_specular["  + gl_MaxLights + "];",
                    "uniform vec4 uLightSource_position["  + gl_MaxLights + "];",
                    "uniform vec4 uLightSource_halfVector["  + gl_MaxLights + "];",
                    "uniform vec4 uLightSource_spotDirection["  + gl_MaxLights + "];",
                    "uniform float uLightSource_spotExponent["  + gl_MaxLights + "];",
                    "uniform float uLightSource_spotCutoff["  + gl_MaxLights + "];",
                    "uniform float uLightSource_spotCosCutoff["  + gl_MaxLights + "];",
                    "uniform float uLightSource_constantAttenuation["  + gl_MaxLights + "];",
                    "uniform float uLightSource_linearAttenuation["  + gl_MaxLights + "];",
                    "uniform float uLightSource_quadraticAttenuation["  + gl_MaxLights + "];",
                    "",
            //        IE 11 doesn't currently support structs
            //        "struct materialParameters",
            //        "{",
            //        "   vec4 ambient;",
            //        "   vec4 diffuse;",
            //        "   vec4 specular;",
            //        "   vec4 emission;",
            //        "   float shininess;",
            //        "};",
            //        "",
            //        "uniform materialParameters uFrontMaterial;",
                    "uniform vec4 uFrontMaterial_ambient;",
                    "uniform vec4 uFrontMaterial_diffuse;",
                    "uniform vec4 uFrontMaterial_specular;",
                    "uniform vec4 uFrontMaterial_emission;",
                    "uniform float uFrontMaterial_shininess;",
                    "",
                    "uniform int uLightingEnabled;",
                    "uniform int uTexturesEnabled;",
                    "uniform int uTextureStageEnabled[" + gl_MaxTextureStages + "];",       
                    "uniform sampler2D uTextureSamplerColor[" + gl_MaxTextureStages + "];",
                    "uniform sampler2D uTextureSamplerAlpha[" + gl_MaxTextureStages + "];",
                    "uniform int uTextureBlendOp;",
                    "",
                    "varying vec4 vVertexPosition;",
                    "varying vec4 vTransformedNormal;",
                    "varying vec4 vViewPosition;",
                    "varying vec4 vViewDirection;",
                    "varying vec2 vTextureCoord[" + gl_MaxTextureStages + "];",
                    "",
                    "void directionalLight(vec4 position, vec4 ambient, vec4 diffuse, vec4 specular, vec3 normal, vec3 halfVector)",
                    "{",
                    "   vec3 lightDir;",
                    "   float nDotL;",      // normal . light direction
                    "   float nDotHV;",     // normal . half-vector
                    "   float pf;",         // power factor
                    "",
                    "   lightDir = normalize(vec3(position));",
                    "",	
                    "   nDotL = max(dot(normal, lightDir), 0.0);",
                    "   if (nDotL == 0.0)",
                    "   {",
                    "       pf = 0.0;",
                    "   }",
                    "   else",
                    "   {",
                    "       nDotHV = max(0.0, dot(normal, halfVector));",
                    "       pf = pow(nDotHV, uFrontMaterial_shininess);",
                    "   }",
                    "",
                    "   gAmbient  += ambient * uFrontMaterial_ambient;",
                    "   gDiffuse  += diffuse * uFrontMaterial_diffuse * nDotL;",
                    "   gSpecular += specular * uFrontMaterial_specular * pf;",
                    "}",
                    "",
                    "void pointLight(vec4 position, float constantAttenuation, float linearAttenuation, float quadraticAttenuation,",
                    "                vec4 ambient, vec4 diffuse, vec4 specular, vec3 normal, vec3 eye, vec3 vPosition)",
                    "{",
                    "   float nDotL;",      // normal . light direction
                    "   float nDotHV;",     // normal . light half vector
                    "   float pf;",         // power factor
                    "   float attenuation;",// computed attenuation factor
                    "   float d;",          // distance from surface to light source
                    "   vec3  L;",          // direction from surface to light position
                    "   vec3  halfVector;", //
                    "",
                    "", // Compute vector from surface to light position
                    "   L = vec3(position) - vPosition;",
                    "",
                    "", // Compute distance between surface and light position
                    "   d = length(L);",
                    "",
                    "", // Normalize the vector from surface to light position,
                    "   L = normalize(L);",
                    "",
                    "", // Compute attenuation,
                    "   attenuation = 1.0 / (constantAttenuation +",
                    "      linearAttenuation * d +",
                    "      quadraticAttenuation * d * d);",
                    "",
                    "   nDotL = max(0.0, dot(normal, L));",
                    "   nDotHV = max(0.0, dot(normal, normalize(L + eye)));",
                    "",
                    "   if (nDotL == 0.0)",
                    "   {",
                    "       pf = 0.0;",
                    "   }",
                    "   else",
                    "   {",
                    "       pf = pow(nDotHV, uFrontMaterial_shininess);",
                    "   }",
                    "",    
                    "   gAmbient  += ambient * uFrontMaterial_ambient * attenuation;",
                    "   gDiffuse  += diffuse * uFrontMaterial_diffuse * nDotL * attenuation;",
                    "   gSpecular += specular * uFrontMaterial_specular * pf * attenuation;",
                    "}",
                    "",
                    "void main()",
                    "{",
                    "   vec4 lightingFactor;",
                    "   if (uLightingEnabled != 0)",
                    "   {",
                    "       gAmbient = vec4(0, 0, 0, 0);",
                    "       gDiffuse = vec4(0, 0, 0, 0);",
                    "       gSpecular = vec4(0, 0, 0, 0);",
                    "",
                    "       for (int i=0; i < " + gl_MaxLights + "; i++)",
                    "       {",
                    "           if (uLightSource_enabled[i] != 0)",
                    "           {",
                    "               if (uLightSource_position[i][3] == 0.0)", // directional light
                    "               {",
                    "                   directionalLight(uLightSource_position[i], uLightSource_ambient[i],",
                    "                       uLightSource_diffuse[i], uLightSource_specular[i],",
                    "                       normalize(vec3(vTransformedNormal)),",
                    "                       normalize(vec3(vViewDirection) + vec3(uLightSource_position[i])));",
                    "               }",
                    "               else if (uLightSource_spotCutoff[i] > 90.0)", // point light
                    "               {",
                    "                   pointLight(uLightSource_position[i], uLightSource_constantAttenuation[i],",
                    "                       uLightSource_linearAttenuation[i], uLightSource_quadraticAttenuation[i],",
                    "                       uLightSource_ambient[i], uLightSource_diffuse[i], uLightSource_specular[i],",
                    "                       normalize(vec3(vTransformedNormal)),",
                    "                       vec3(vViewDirection), vec3(vVertexPosition));",
                    "               }",
                    "               else", // spotlight
                    "               {",
                    "               }",   
                    "           }",
                    "       }",
                    "",
                    "       lightingFactor  = uGlobalAmbientLight * uFrontMaterial_ambient;", // global ambient contribution
                    "       lightingFactor += gAmbient + gDiffuse + gSpecular;", // light contribution(s)
                    "       lightingFactor.a  = uFrontMaterial_ambient.a / 3.0 + ",
                    "                           uFrontMaterial_diffuse.a / 3.0 + ",
                    "                           uFrontMaterial_specular.a / 3.0;",
                    "   }",
                    "   else", // uLightingEnabled == 0
                    "   {",
                    "",     // TODO: use vertex color
                    "       lightingFactor = vec4(1, 1, 1, 1);",
                    "   }",
                    "",
                    "   vec4 fragmentColor;",
                    "   vec4 fragmentColor1;",
                    "   vec4 fragmentColor2;",
                    "   if (uTexturesEnabled == 1 && uTextureStageEnabled[0] == 1 && uTextureStageEnabled[1] == 0)",
                    "   {",
                    "       fragmentColor = texture2D(uTextureSamplerColor[0], vec2(vTextureCoord[0].s, vTextureCoord[0].t));",
                    "       if (uTextureBlendOp == " + RC_MODULATE + ")",
                    "       {",
                    "           if (fragmentColor.a == 0.0) discard;",
                    "           else gl_FragColor = fragmentColor * lightingFactor;",
                    "       }",
                    "       else if (uTextureBlendOp == " + RC_REPLACE + ")",
                    "       {",
                    "           gl_FragColor = fragmentColor;",
                    "       }",
                    "       else",
                    "       {",
                    "           fragmentColor = vec4(1, 1, 1, 1);",
                    "           gl_FragColor = fragmentColor * lightingFactor;",
                    "       }",
                    "   }",
                    "   else if (uTexturesEnabled == 1 && uTextureStageEnabled[0] == 1 && uTextureStageEnabled[1] == 1)",
                    "   {",
                    "       fragmentColor1 = texture2D(uTextureSamplerColor[0], vec2(vTextureCoord[0].s, vTextureCoord[0].t));",
                    "       fragmentColor2 = texture2D(uTextureSamplerColor[1], vec2(vTextureCoord[1].s, vTextureCoord[1].t));",
                    "       if (uTextureBlendOp == " + RC_MODULATE + ")",
                    "       {",
                    "           fragmentColor1.a = fragmentColor2.a;",
                    "           if (fragmentColor1.a == 0.0) discard;",
                    "           else gl_FragColor = fragmentColor1 * lightingFactor;",
                    "       }",
                    "       else if (uTextureBlendOp == " + RC_REPLACE + ")",
                    "       {",
                    "           gl_FragColor = fragmentColor1 * fragmentColor2;",
                    "       }",
                    "       else",
                    "       {",
                    "           fragmentColor = vec4(1, 1, 1, 1);",
                    "           gl_FragColor = fragmentColor * lightingFactor;",
                    "       }",
                    "   }",
                    "   else", // uTexturesEnabled == 0
                    "   {",
                    "       fragmentColor = vec4(1, 1, 1, 1);",
                    "       gl_FragColor = fragmentColor * lightingFactor;",
                    "   }",
                    "}"
                    ].join("\n");
            }
            break;
        
        default:
            return { vertex: null, fragment: null };
            break;
    }
    
    var vs = gl.createShader(gl.VERTEX_SHADER); 
    if (vs)
    {
        gl.shaderSource(vs, source_vs);
        gl.compileShader(vs);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
        {
            alert(gl.getShaderInfoLog(vs));
        }
    }
    
    var fs = gl.createShader(gl.FRAGMENT_SHADER); 
    if (fs) 
    {
        gl.shaderSource(fs, source_fs);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
        {
            alert(gl.getShaderInfoLog(fs));
        }
    }
                    
    return { vertex: vs, fragment: fs };
}
ContentHandler.prototype = new AttributeContainer();
ContentHandler.prototype.constructor = ContentHandler;

function ContentHandler()
{
    AttributeContainer.call(this);
    this.className = "ContentHandler";
    
    this.contentDirectory = new StringAttr("");
    this.url = new StringAttr("");
    
    this.registerAttribute(this.contentDirectory, "contentDirectory");
    this.registerAttribute(this.url, "url");
}

ContentHandler.prototype.parseFileStream = function(file)
{
}

ContentHandler.prototype.matchesType = function(type)
{
}

ContentBuilder.prototype = new AttributeContainer();
ContentBuilder.prototype.constructor = ContentBuilder;

function ContentBuilder()
{
    AttributeContainer.call(this);
    this.className = "ContentBuilder";
    
    this.models = [];
    this.evaluators = [];
    
    this.layer = 0;
    this.invertAlpha = new BooleanAttr(false);
    
    this.registerAttribute(this.invertAlpha, "invertAlpha");
}

ContentBuilder.prototype.visitHandler = function(handler)
{
}
/*
ContentBuilder.prototype.configure = function(models, evaluators)
{
    this.models = models;
    this.evaluators = evaluators;
}
*/
ContentBuilder.prototype.finalize = function()
{
}

ContentBuilder.prototype.matchesType = function(type)
{
}

function BinaryParser(stream, bigEndian)
{
    this.stream = stream;
    this.bigEndian = bigEndian;
    
    this.readUInt8  = function() { return this.decodeInt(8, false); }
    this.readUInt16 = function() { return this.decodeInt(16, false); }
    this.readUInt32 = function() { return this.decodeInt(32, false); }
    this.readInt8   = function() { return this.decodeInt(8, true); }
    this.readInt16  = function() { return this.decodeInt(16, true); }
    this.readInt32  = function() { return this.decodeInt(32, true); }
    this.readFloat32 = function(){ return this.decodeFloat32(); }
   
    var pos = 0;
     
    this.decodeInt = function(bits, signed)
    {
        var sum = 0;
        var bytes = bits / 8;
        var byteValue = 0;
        
        // sum bytes
        for (var B=0; B < bytes; B++)
        {
            byteValue = this.bigEndian ? this.stream.charCodeAt(pos+B) 
                                       : this.stream.charCodeAt(pos+(bytes-B-1));
            // sum bits
            for (var b=7; b >= 0; b--)
            {
                sum = sum * 2 + ((1 << b) & byteValue ? 1 : 0);
            }
        }
        
        // account for sign
        if (signed)
        {
            max = Math.pow(2, bits);
            sum = sum >= max / 2 ? sum - max : sum;
        }
        
        // advance stream position
        pos += bytes;
        
        return sum;
	}
	
	// based upon example from: http://en.wikipedia.org/wiki/Binary32
	this.decodeFloat32 = function()
	{
	    var sum = 0;
	    var bytes = 4;
	    var byteValue = new Array(bytes);
	    
	    // read the bytes representing the float
	    for (var B=0; B < bytes; B++)
	    {
	        this.bigEndian ? byteValue[B] = this.stream.charCodeAt(pos+B)
	                       : byteValue[B] = this.stream.charCodeAt(pos+(bytes-B-1));
	    }
	    
	    // read sign bit (bit 31)
	    var negative = byteValue[0] & 0x80;

	    // read exponent bits (bits 30-23)
	    var exponent = 0; 
	    for (var e=6; e >= 0; e--)
        {
            exponent = exponent * 2 + ((1 << e) & byteValue[0] ? 1 : 0);
        }
        exponent = exponent * 2 + (0x80 & byteValue[1] ? 1 : 0);
	    
	    // read significand bits (bits 22-0)
	    var significand = 0;
	    // byte 1
	    for (var s=6; s >= 0; s--)
	    {
	        significand = significand * 2 + ((1 << s) & byteValue[1] ? 1 : 0);
	    }
	    // byte 2, 3
	    for (var B=2; B <= 3; B++)
	    {
	        for (var s=7; s >= 0; s--)
	        {
	            significand = significand * 2 + ((1 << s) & byteValue[B] ? 1 : 0);
	        }
	    }

        // decode exponent by subtracting 127
        var decodedExponent = exponent - 127;
        
        // decode the significand using:
        // each of the 24 bits of the significand, bit 23 to bit 0, represents a value, 
        // starting at 1 and halves for each bit:
        // bit 23 = 1
        // bit 22 = 0.5
        // bit 21 = 0.25
        // bit 20 = 0.125
        // bit 19 = 0.0625
        // .
        // .
        // bit  0 = 0.00000011920928955078125
        var decodedSignificand = 1; // implicit 24th bit set to 1
        var bitvalue = 1;
        for (var s=23; s >= 0; s--)
        {
            decodedSignificand = decodedSignificand + ((1 << s) & significand ? bitvalue : 0);
            bitvalue /= 2;
        }
        
        // multiply significand with the base, 2, to the power of the exponent to get the final result
        sum = decodedSignificand * Math.pow(2, decodedExponent) * (negative ? -1 : 1);
        
	    // advance stream position
	    pos += bytes;
	    
	    return sum;
	}
}
function TextParser(stream)
{
    this.stream = stream;
    
    var pos = 0;
    
    this.readCharacter = function()
    {
        if (pos >= this.stream.length) return null;
        
        return this.stream[pos++];
    }
    
    this.readToken = function()
    {
        var c;
        var token = "";
        
        if (pos >= this.stream.length) return null;
        
        // read leading whitespace
        do
        {
            c = this.stream[pos++];
        }
        while (pos < this.stream.length && isSpace(c));
        
        // read token
		do
		{
			token += c;
			c = this.stream[pos++];
		}
		while (pos < this.stream.length && !isSpace(c));
		
		return (token.length > 0 ? token : null);
    }
    
    this.readLine = function()
    {
        var line = "";
        
        if (pos >= this.stream.length) return null;
        
        while (pos < this.stream.length && this.stream[pos] != '\n')
        {
            line += this.stream[pos++];
        }
        pos++;
        
        return line;        
    }
    
    this.readLineTokens = function()
    {
        var c;
        var p = 0;
        var token = "";
        var tokens = [];
        
        var line = this.readLine();
        if (line == null) return null;

        while (p < line.length)
        {
            // read leading whitespace
            do
            {
                c = line[p++];
            }
            while (p < line.length && isSpace(c));
            
            // read token
		    do
		    {
			    token += c;
			    c = line[p++];
		    }
		    while (p < line.length && !isSpace(c));
    		
		    tokens.push(token);
		    token = "";
		}
		
		return tokens;
    }
}
function XMLParser(factory, registry, contentDir)
{
    this.factory = factory;
    this.registry = registry;
    this.contentDir = contentDir;
    this.attributeStack = new Stack();
    this.collectionCountStack = new Stack();
}

XMLParser.prototype.parse = function(xml)
{
    parser = new SAXDriver();
   
    parser.setDocumentHandler(this);
    parser.setErrorHandler(this);
    parser.setLexicalHandler(this);

    parser.parse(xml);
}

XMLParser.prototype.processingInstruction = function(target, data)
{
    switch (target)
    {
        case "bw":
            {
                // TODO
                console.debug("TODO: " + target.toString());
            }
            break;

        case "bwinclude":
            {
                var dataString = new String(data);

                // url
                var url = this.parseTokenValue(dataString, "url=\"", "\"");
                if (url)
                {
                    console.debug("Processing Instruction for: " + url);
                    var ext = getFileExtension(url);
                    switch (ext) {
                    case "xml":
                        {
                            var xml = loadXMLResource(this.contentDir + "/" + url);
                            this.parse(xml);
                        }
                        break;
                        // TODO: abstract this dependency away from here
                    case "lws":
                        {
                            var pathInfo = formatPath(url);
                            console.debug("Include instruction for path: " + pathInfo[0]);
                            console.debug("Include content dir: " + pathInfo[1]);
            
                            var contentHandler = new LWSceneHandler();
                            contentHandler.getAttribute("contentDirectory").setValueDirect(pathInfo[1]);
            
                            var contentBuilder = new LWSceneBuilder(); 
                            contentBuilder.setRegistry(this.factory.registry);
                            contentBuilder.visitHandler(contentHandler);
            
                            contentHandler.parseFileStream(pathInfo[0]); 
                        }
                        break;
                    }
                }
            }
            break;
    }
}

XMLParser.prototype.startElement = function(name, atts) 
{
    // by convention, AttributeContainers start with capital letters, and 
    // complex attributes do not.
    if (isUpper(name[0]))
    {
        this.parseAttributeContainer(name, atts);
    }
    else 
    {
        this.parseComplexAttribute(name, atts);
    }
}

XMLParser.prototype.endElement = function(name) 
{
    // by convention, AttributeContainers start with capital letters, and 
    // complex attributes do not.
    if (isUpper(name[0]))
    {
        this.parseAttributeContainer(name);
    }
    else 
    {
        this.parseComplexAttribute(name);
    }
}

XMLParser.prototype.startCDATA = function()
{
}

XMLParser.prototype.endCDATA = function()
{
}

XMLParser.prototype.characters = function(data, start, length)
{
    var value = "";
    for (var i = 0; i < length; i++)
    {
        value += data[start + i];
    }
    if (value.length && !isSpace(value[0]))
    {
        var attribute = this.attributeStack.top();
        if (attribute)
        {
            // TODO: resolve reference
            deserializeAttribute(attribute, value);
        }
    }
}

XMLParser.prototype.error = function(exception) 
{
    alert('Error: ' + exception.getMessage());
}

XMLParser.prototype.fatalError = function(exception) 
{
    alert('Fatal Error: ' + exception.getMessage());
}

XMLParser.prototype.parseAttributeContainer = function(name, atts)
{
    if (atts) // element start
    {
        var attribute = this.factory.create(name);
        if (!attribute)
        {
            this.attributeStack.push(null); // for corresponding pop at closing tag
            return;
        }

        if (!resolveAttributeContainerReference(attribute, atts.m_parser.m_atts, this.registry))
        {
            deserializeAttributeContainer(attribute, atts.m_parser.m_atts);
        }

        this.registry.registerResource(attribute);
        
        // if a collection is at the top of the attribute stack which does not allocate its elements,
        // add the attribute it to the collection
        var container = this.attributeStack.top();
        if (container && container.isCollection())
        {
            if (!container.allocatesElements())
            {
                container.push_back(attribute);
                container.setElementName(attribute, name);

                var count = this.collectionCountStack.top();
                count++;
                this.collectionCountStack.pop();
                this.collectionCountStack.push(count);
            }
            else
            {
                container.setElementName(container.getAt(container.Size() - 1), name);
            }
        }

        this.attributeStack.push(attribute);

        if (attribute.isCollection())
        {
            this.collectionCountStack.push(0);
        }
    }
    else // element end
    {
        var attribute = this.attributeStack.top();

        this.attributeStack.pop();

        if (attribute && attribute.isCollection())
        {
            this.collectionCountStack.pop();
        }

        if (attribute)
        {
            this.factory.finalize(name, attribute);
            this.registry.finalizeResource(attribute);
        }
    }
}

XMLParser.prototype.parseComplexAttribute = function(name, atts)
{
    if (atts) // element start
    {
        var container = this.attributeStack.top();
        if (!container) return;

        var attribute = container.getAttribute(name);
        if (!attribute)
        {
            // check for collections here... if a collection is at the top of 
            // the attribute stack, resize the collection (if necessary) to accomodate
            // the current attribute being deserialized
            if (container.isCollection())
            {
                var count = this.collectionCountStack.top();
                count++;

                var size = container.Size();

                if (container.AppendParsedElements())
                {
                    container.resize(size + 1);
                    count = size;
                }
                else if (size <= count)
                {
                    container.resize(count + 1);
                }

                attribute = container.getAt(count);
            }
            else
            {
                this.attributeStack.push(container); // for corresponding pop at closing tag (push container so that child complex attributes can access)
                return;
            }
        }

        this.attributeStack.push(attribute);

        if (attribute && attribute.isContainer())
        {
            if (!resolveAttributeContainerReference(attribute, atts.m_parser.m_atts, this.registry))
            {
                deserializeAttributeContainer(attribute, atts.m_parser.m_atts);
            }

            if (attribute.isCollection())
            {
                this.collectionCountStack.push(0);
            }
        }
        else if (attribute)
        {
            if (!resolveComplexAttributeReference(attribute, atts.m_parser.m_atts))
            {
                deserializeComplexAttribute(attribute, atts.m_parser.m_atts);
            }
        }
    }
    else // element end
    {
        this.attributeStack.pop();

        if (container && container.isCollection())
        {
            this.collectionCountStack.pop();
        }
    }
}

XMLParser.prototype.parsePrimitiveAttribute = function()
{

}

XMLParser.prototype.parseTokenValue = function(string, delim_begin, delim_end)
{
    var begin = string.indexOf(delim_begin);
    if (begin == -1)
    {
        return undefined;
    }
    begin += delim_begin.length;

    var end = string.indexOf(delim_end, begin);
    if (end == -1)
    {
        return undefined;
    }

    return string.substring(begin, end);
}


/**
 *
 */
var ePixelFormat =
{
    Unknown             :-1,
    R8G8B8              : 0,  // 24-bit RGB
    B8G8R8              : 1,  // 24-bit BGR
    X8X8X8              : 2,  // 24-bit RGB (unspecified component order)
    R8G8B8A8            : 3,  // 32-bit RGB Alpha
    B8G8R8A8            : 4,  // 32-bit BGR Alpha
    A8R8G8B8            : 5,  // 32-bit Alpha RGB
    A8B8G8R8            : 6,  // 32-bit Alpha BGR
    X8X8X8X8            : 7,  // 32-bit RGB Alpha (unspecified component order)
    A8                  : 8   //  8-bit Alpha
};

var ePixelMap =
{
    Default             : 0,  // default mapping -- R to R, G to G, B to B, Alpha to Alpha
    RGBToAlpha          : 1   // average RGB components and map to Alpha component
};

function BytesPerPixel(pixelFormat)
{
    switch (pixelFormat)
    {
    case ePixelFormat.R8G8B8:
    case ePixelFormat.B8G8R8:
    case ePixelFormat.X8X8X8:
        return 3;

    case ePixelFormat.R8G8B8A8:
    case ePixelFormat.B8G8R8A8:
    case ePixelFormat.A8R8G8B8:
    case ePixelFormat.A8B8G8R8:
    case ePixelFormat.X8X8X8X8:
        return 4;

    case ePixelFormat.A8:
        return 1;

    default:
        return 0;
    }
}

function TPixel(r, g, b, a)
{
    var red = r || 0;
    var green = g || 0;
    var blue = b || 0;
    var alpha = a || 0;
}

/**
 *
 */
var eImageFormat =
{
    Unknown             :-1,
    RGB                 : 0,
    RGBA                : 1,
    Alpha               : 2,
    Luminance           : 3,
    Luminance_Alpha     : 4
}
function ScaleImage(pixelFormat, widthIn, heightIn, byteAlignmentIn, dataIn, widthOut, heightOut, byteAlignmentOut, dataOut)
{
    // currently supporting image pixel formats: RGBA
    if (pixelFormat != ePixelFormat.R8G8B8A8)
    {
        return false;
    }

    var canvasIn = document.createElement("canvas");
    canvasIn.width = widthIn;
    canvasIn.height = heightIn;
    
    var ctxIn = canvasIn.getContext("2d");
    var imageDataIn = ctxIn.createImageData(widthIn, heightIn);

    var i = 0;
    for (var row = 0; row < heightIn; row++)
    {
        for (var col = 0; col < widthIn; col++)
        {
            for (var component = 0; component < 4; component++, i++)
            {
                imageDataIn.data[i] = dataIn[i];
            }
        }
    }

    ctxIn.putImageData(imageDataIn, 0, 0);

    var canvasOut = document.createElement("canvas");
    canvasOut.width = widthOut;
    canvasOut.height = heightOut;

    var ctxOut = canvasOut.getContext("2d");
    
    ctxOut.drawImage(canvasIn,
                     0, 0, canvasIn.width, canvasIn.height,
                     0, 0, canvasOut.width, canvasOut.height);
               
    var imageDataOut = ctxOut.getImageData(0, 0, widthOut, heightOut);

    i = 0;
    for (var row = 0; row < heightOut; row++)
    {
        for (var col = 0; col < widthOut; col++)
        {
            for (var component = 0; component < 4; component++, i++)
            {
                dataOut[i] = imageDataOut.data[i];
            }
        }
    }

    return true;
}
// filter flags for GetFrameData() filterMask parameter
var FRAME_FILTER_SCALE_FRAME_BIT    = 0x001;    // scale frame to size of incoming buffer before copying
var FRAME_FILTER_INVERT_FRAME_BIT   = 0x002;    // invert frame
var FRAME_FILTER_NEGATE_COLOR_BIT   = 0x004;    // invert rgb pixel data (subtract from 255)
var FRAME_FILTER_NEGATE_ALPHA_BIT   = 0x008;    // invert alpha pixel data (subtract from 255)
var FRAME_FILTER_ALPHA_ONOFF_BIT    = 0x010;    // set alpha pixel to 0 or 255; alpha values in the range
                                                // [0, 127] are set to 0, [128, 255] are set to 255
                                                
function MediaPlayback(container, onload)
{
    this.container = container;
    this.onload = onload;

    this.url = null;
    this.video = false;
    this.ready = false;
    this.alphaPlayback = null;
    this.frameRetrieved = false;
    this.htmlImageElement = null;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.imagePitch = 0;
    this.imagePixels = null;
}

MediaPlayback.prototype.loadImage = function(url)
{
    this.ready = false;
    this.frameRetrieved = false;
    this.htmlImageElement = null;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.imagePitch = 0;
    this.imagePixels = null;

    var extension = getFileExtension(url);

    switch (extension)
    {
        case "avi":
        case "mpg":
        case "ogg":
            {

                this.htmlImageElement = document.createElement("video");
                this.htmlImageElement.container = this;
                this.htmlImageElement.controls = "controls";
                //this.htmlImageElement.preload = "auto";
                //this.htmlImageElement.autoplay = "autoplay";
                //this.htmlImageElement.setAttribute("controls", "controls");
                //this.htmlImageElement.setAttribute("preload", "preload");
                //this.htmlImageElement.setAttribute("autoplay", "autoplay");

                //this.htmlImageElement.canvas = document.createElement("canvas");
                //this.htmlImageElement.canvasContext = this.htmlImageElement.canvas.getContext("2d");

                //this.htmlImageElement.addEventListener("play", MediaTexture_OnVideoPlay, false);
                //this.htmlImageElement.onload = MediaTexture_OnVideoLoad;

                //this.onVideoPlay();
                this.htmlImageElement.src = "http://localhost/bwjs/BwContent/images/Bear.ogg"; //url;

                this.video = true;
                this.onVideoLoad();

                /*
                this.htmlImageElement = document.createElement("video"); //new Image();
                this.htmlImageElement.container = this;
                this.htmlImageElement.preload = "auto";
                this.htmlImageElement.autoplay = "autoplay";
                this.htmlImageElement.onload = MediaPlayback_OnVideoLoad;
                this.htmlImageElement.src = imageFilename;
                //this.imageSet = true;
                //this.video = true;
                */
                //var resource = loadBinaryResource(imageFilename);
                //alert(resource);
            }
            break;

        default:
            {
                this.htmlImageElement = new Image(); //document.createElement("img");
                this.htmlImageElement.container = this;
                this.htmlImageElement.onload = MediaPlayback_OnImageLoad;
                this.htmlImageElement.src = url;
            }
            break;
    }

    this.url = url;
}

MediaPlayback.prototype.onImageLoad = function()
{
    var image = this.htmlImageElement;
    this.imageWidth = image.width;
    this.imageHeight = image.height;
    this.imagePitch = image.width * 4; // rgba
    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    canvasContext.drawImage(image, 0, 0);
    var imageData = canvasContext.getImageData(0, 0, image.width, image.height);
    this.imagePixels = imageData.data;

    this.ready = true;

    if (this.onload)
    {
        this.onload.call(this);
    }
}

MediaPlayback.prototype.onVideoLoad = function()
{
    this.ready = true;
}

MediaPlayback.prototype.getFrameDimensions = function()
{
    return { width: this.imageWidth, height: this.imageHeight, pitch: this.imagePitch };
}

MediaPlayback.prototype.getPixelFormat = function()
{
    return ePixelFormat.R8G8B8A8;
}

MediaPlayback.prototype.getPixelByteAlignment = function()
{
    return 4;
}

MediaPlayback.prototype.getBytesPerPixel = function()
{
    return BytesPerPixel(this.getPixelFormat());
}

/**
 * Retrieve the pixels for the current frame.
 * @param buffer        - incoming buffer to receive pixel data.
 * @param frame         - optional parameter specifying the frame number to retrieve.
 * @return number       - the frame number retrieved, -1 for single-frame images, or undefined on failure.
 */
MediaPlayback.prototype.getFramePixels = function(buffer, frame)
{
    // verify validity of image data
    if (!this.ready ||
        this.imageWidth == 0 ||
        this.imageHeight == 0 ||
        !this.imagePixels)
    {
        return undefined;
    }

    buffer.length = this.imagePixels.length;
    for (var i = 0; i < this.imagePixels.length; i++)
    {
        buffer[i] = this.imagePixels[i];
    }

    return -1; // single-frame image
}

MediaPlayback.prototype.newFrameDataAvailable = function()
{
    return this.ready && !this.frameRetrieved;
}

/**
 * Retrieve the pixels for the current frame in the specified pixel format and dimensions.
 * @param width         - width of the incoming buffer in pixels.
 * @param height        - height of the incoming buffer in pixels.
 * @param pitch         - width of a scan line of pixels in bytes; may differ from width * bytes
 *                        per pixel if pixels are padded to 2- or 4-byte boundaries.
 * @param pixelFormat   - pixel format of the incoming buffer.
 * @param buffer        - incoming buffer to receive pixel data.
 * @param filterMask    - zero or more OR'd filtering flags controlling how the image is filtered:
 *
 *                        FRAME_FILTER_SCALE_FRAME_BIT  - the frame is first scaled to the size 
 *                                                        of the incoming buffer before copying
 *                        FRAME_FILTER_INVERT_FRAME_BIT - the frame is inverted before copying
 *                        FRAME_FILTER_NEGATE_COLOR_BIT - the rgb pixel data is inverted (subtracted from 255) 
 *                        FRAME_FILTER_NEGATE_ALPHA_BIT - the alpha pixel data is inverted (subtracted from 255)
 *                        FRAME_FILTER_ALPHA_ONOFF_BIT  - set alpha pixel to 0 or 255; alpha values in the range
 *                                                        [0, 127] are set to 0, [128, 255] are set to 255
 *
 * @param pixelMap      - pixel mapping to perform; default: PixelMap_Default.
 * @param frame         - optional parameter specifying the frame number to retrieve.
 * @return number       - the frame number retrieved, -1 for single-frame images, or undefined on failure.
 */
MediaPlayback.prototype.getFrameData = function(width, height, pitch, pixelFormat, buffer, filterMask, pixelMap, frame)
{
    // verify validity of image data
    if (!this.ready ||
        this.imageWidth == 0 ||
        this.imageHeight == 0 ||
        !this.imagePixels)
    {
        return undefined;
    }

    // check params
    if (width == 0 ||
        height == 0 ||
        pitch < width ||
        pixelFormat == ePixelFormat.Unknown ||
        !buffer)
    {
        return undefined;
    }

    var frameRetrieved = -1;

    // get filter flags
    var scaleFrame = filterMask & FRAME_FILTER_SCALE_FRAME_BIT ? true : false;
    var invertFrame = filterMask & FRAME_FILTER_INVERT_FRAME_BIT ? true : false;
    var negateColor = filterMask & FRAME_FILTER_NEGATE_COLOR_BIT ? true : false;
    var negateAlpha = filterMask & FRAME_FILTER_NEGATE_ALPHA_BIT ? true : false;
    var alphaOnOff = filterMask & FRAME_FILTER_ALPHA_ONOFF_BIT ? true : false;

    // get image dimensions
    var dims = this.getFrameDimensions();
    var imageWidth = dims.width;
    var imageHeight = dims.height;
    var imagePitch = dims.pitch;

    // get image pixel format
    var imagePixelFormat = this.getPixelFormat();

    // currently supporting image pixel formats: RGBA
    if (imagePixelFormat != ePixelFormat.R8G8B8A8)
    {
        return undefined;
    }

    // get image pixels
    var pixels = [];
    var imageFrameRetrieved = this.getFramePixels(pixels, frame);
    if (imageFrameRetrieved == undefined)
    {
        return undefined;
    }

    // scale pixels if necessary
    if (scaleFrame && (width != imageWidth || height != imageHeight))
	{
		var imageBytesPerPixel = this.getBytesPerPixel();

		// calculate pitch (using byte aligment of "4")
		imagePitch = width * imageBytesPerPixel;
		imagePitch += (4 - imagePitch % 4) % 4;

		var scaledPixels = [];
		if (!ScaleImage(imagePixelFormat, imageWidth, imageHeight, this.getPixelByteAlignment(), pixels, 
			width, height, 4, scaledPixels))
		{
			return undefined;
		}

		pixels = scaledPixels;
		imageWidth = width;
		imageHeight = height;
	}

    // if no alpha channel, rgb pixel data is not to be negated, frame is not to be inverted,
    // and incoming buffer has same parameters as pixel buffer, copy bits
    if (!this.alphaPlayback &&
		!negateColor &&
		!invertFrame &&
		imagePitch == pitch &&
		imageHeight == height &&
		imagePixelFormat == pixelFormat)
    {
        for (var i = 0; i < buffer.length; i++)
        {
            buffer[i] = pixels[i];
        }
        
        this.frameRetrieved = true;
        return frameRetrieved;
    }

    // get alpha data
    var alphaWidth = 0;
	var alphaHeight = 0;
	var alphaPitch = 0;
	var alphaPixelFormat;
	var alphaPixels = null;
	if (this.alphaChannel)
	{
		// get alpha dimensions
		dims = this.alphaChannel.getFrameDimensions();
		alphaWidth = dims.width;
		alphaHeight = dims.height;
		alphaPitch = dims.pitch;

		// get alpha pixel format
		alphaPixelFormat = this.alphaChannel.getPixelFormat();
    
		// currently only supporting alpha pixel formats: RGBA
		if (alphaPixelFormat != ePixelFormat.R8G8B8A8)
		{
			return undefined;
		}

		// get alpha pixels
		var alphaFramePixels = [];
		var alphaFrameRetrieved = this.alphaChannel.getFramePixels(alphaFramePixels, imageFrameRetrieved);
		if (alphaFrameRetrieved != undefined)
		{
		    // scale alpha pixels to match frame data
		    if (alphaWidth != imageWidth ||
			    alphaHeight != imageHeight)
		    {
			    var alphaBytesPerPixel = this.alphaChannel.getBytesPerPixel();

			    // calculate pitch (using byte aligment of "4")
			    alphaPitch = imageWidth * alphaBytesPerPixel;
			    alphaPitch += (4 - alphaPitch % 4) % 4;

			    var scaledAlphaPixels = [];
			    if (ScaleImage(alphaPixelFormat, alphaWidth, alphaHeight, 
				    this.alphaChannel.getPixelByteAlignment(), alphaPixels, imageWidth, 
				    imageHeight, 4, scaledAlphaPixels))
			    {
			        alphaPixels = scaledAlphaPixels;
			        alphaWidth = imageWidth;
			        alphaHeight = imageHeight;
			    }
		    }
		    else
		    {
		        alphaPixels = alphaFramePixels;
		    }
		}
	}
	
    // determine dimensions to copy
    var copyWidth = Math.min(width, imageWidth);
    var copyHeight = Math.min(height, imageHeight);

    // set component positions for buffer pixel format
    var rPos = 0, gPos = 0, bPos = 0, aPos = 0;
    switch (pixelFormat)
    {
        case ePixelFormat.R8G8B8: rPos = 0; gPos = 1; bPos = 2; break;
        case ePixelFormat.B8G8R8: rPos = 2; gPos = 1; bPos = 0; break;
        case ePixelFormat.R8G8B8A8: rPos = 0; gPos = 1; bPos = 2; aPos = 3; break;
        case ePixelFormat.B8G8R8A8: rPos = 2; gPos = 1; bPos = 0; aPos = 3; break;
        case ePixelFormat.A8R8G8B8: rPos = 1; gPos = 2; bPos = 3; aPos = 0; break;
        case ePixelFormat.A8B8G8R8: rPos = 3; gPos = 2; bPos = 1; aPos = 0; break;
    }

    // if frame is to be inverted, start copying from last row of data
    var fromImage = 0, fromAlpha = 0, to = 0;
    if (invertFrame)
    {
        fromImage += imagePitch * (copyHeight - 1);

        if (alphaPixels)
        {
            fromAlpha += alphaPitch * (copyHeight - 1);
        }
    }

    // copy pixel data to buffer
    var pixel = new TPixel(0, 0, 0, 255);
    var alphaPixel = new TPixel(0, 0, 0, 255);
    for (var row = 0; row < copyHeight; row++)
    {
        for (var col = 0; col < copyWidth; col++)
        {
            // get image pixel
            /*
            switch (imagePixelFormat)
            {
            case ePixelFormat.R8G8B8:
            pixel.red = pixels[fromImage];
            pixel.green = pixels[fromImage + 1];
            pixel.blue = pixels[fromImage + 2];
            fromImage += 3;
            break;

                case ePixelFormat.B8G8R8:
            pixel.red = pixels[fromImage + 2];
            pixel.green = pixels[fromImage + 1];
            pixel.blue = pixels[fromImage];
            fromImage += 3;
            break;

                case ePixelFormat.R8G8B8A8:
            pixel.red = pixels[fromImage];
            pixel.green = pixels[fromImage + 1];
            pixel.blue = pixels[fromImage + 2];
            pixel.alpha = pixels[fromImage + 3];
            fromImage += 4;
            break;

                case ePixelFormat.B8G8R8A8:
            pixel.red = pixels[fromImage + 2];
            pixel.green = pixels[fromImage + 1];
            pixel.blue = pixels[fromImage];
            pixel.alpha = pixels[fromImage + 3];
            fromImage += 4;
            break;

                case ePixelFormat.A8B8G8R8:
            pixel.red = pixels[fromImage + 3];
            pixel.green = pixels[fromImage + 2];
            pixel.blue = pixels[fromImage + 1];
            pixel.alpha = pixels[fromImage];
            fromImage += 4;
            break;
            }
            */
            pixel.red = pixels[fromImage];
            pixel.green = pixels[fromImage + 1];
            pixel.blue = pixels[fromImage + 2];
            pixel.alpha = pixels[fromImage + 3];
            fromImage += 4;

            // negate rgb data if requested
            if (negateColor)
            {
                pixel.red = 255 - pixel.red;
                pixel.green = 255 - pixel.green;
                pixel.blue = 255 - pixel.blue;
                pixel.alpha = 255 - pixel.alpha;
            }

            // get alpha pixel
            if (alphaPixels)
            {
                /*
                switch (alphaPixelFormat)
                {
                case ePixelFormat.R8G8B8:
                alphaPixel.red = alphaPixels[fromAlpha];
                alphaPixel.green = alphaPixels[fromAlpha + 1];
                alphaPixel.blue = alphaPixels[fromAlpha + 2];
                fromAlpha += 3;
                break;

                    case ePixelFormat.B8G8R8:
                alphaPixel.red = alphaPixels[fromAlpha + 2];
                alphaPixel.green = alphaPixels[fromAlpha + 1];
                alphaPixel.blue = alphaPixels[fromAlpha];
                fromAlpha += 3;
                break;

                    case ePixelFormat.R8G8B8A8:
                alphaPixel.red = alphaPixels[fromAlpha];
                alphaPixel.green = alphaPixels[fromAlpha + 1];
                alphaPixel.blue = alphaPixels[fromAlpha + 2];
                alphaPixel.alpha = alphaPixels[fromAlpha + 3];
                fromAlpha += 4;
                break;

                    case ePixelFormat.B8G8R8A8:
                alphaPixel.red = alphaPixels[fromAlpha + 2];
                alphaPixel.green = alphaPixels[fromAlpha + 1];
                alphaPixel.blue = alphaPixels[fromAlpha];
                alphaPixel.alpha = alphaPixels[fromAlpha + 3];
                fromAlpha += 4;
                break;
                }
                */
                alphaPixel.red = alphaPixels[fromAlpha];
                alphaPixel.green = alphaPixels[fromAlpha + 1];
                alphaPixel.blue = alphaPixels[fromAlpha + 2];
                alphaPixel.alpha = alphaPixels[fromAlpha + 3];
                fromAlpha += 4;
            }

            // negate alpha data if requested
            if (negateAlpha)
            {
                alphaPixel.red = 255 - alphaPixel.red;
                alphaPixel.green = 255 - alphaPixel.green;
                alphaPixel.blue = 255 - alphaPixel.blue;
                alphaPixel.alpha = 255 - alphaPixel.alpha;
            }

            // copy to buffer
            switch (pixelFormat)
            {
                case ePixelFormat.R8G8B8:
                case ePixelFormat.B8G8R8:
                    buffer[to + rPos] = pixel.red;
                    buffer[to + gPos] = pixel.green;
                    buffer[to + bPos] = pixel.blue;
                    to += 3;
                    break;

                case ePixelFormat.R8G8B8A8:
                case ePixelFormat.B8G8R8A8:
                case ePixelFormat.A8R8G8B8:
                case ePixelFormat.A8B8G8R8:
                    switch (pixelMap)
                    {
                        case ePixelMap.RGBToAlpha:
                            buffer[to + rPos] = 0;
                            buffer[to + gPos] = 255;
                            buffer[to + bPos] = 0;
                            if (alphaPixels)
                            {
                                buffer[to + aPos] =
								((pixel.red + pixel.green + pixel.blue) / 3) &
								((alphaPixel.red + alphaPixel.green + alphaPixel.blue) / 3);
                            }
                            else
                            {
                                buffer[to + aPos] = (pixel.red + pixel.green + pixel.blue) / 3;
                            }
                            if (alphaOnOff)
                            {
                                buffer[to + aPos] = (buffer[to + aPos] <= 127 ? 0 : 255);
                            }
                            to += 4;
                            break;

                        case ePixelMap.Default:
                        default:
                            buffer[to + rPos] = pixel.red;
                            buffer[to + gPos] = pixel.green;
                            buffer[to + bPos] = pixel.blue;
                            if (alphaPixels)
                            {
                                buffer[to + aPos] = (alphaPixel.red + alphaPixel.green + alphaPixel.blue) / 3;
                            }
                            else
                            {
                                buffer[to + aPos] = pixel.alpha;
                            }
                            if (alphaOnOff)
                            {
                                buffer[to + aPos] = (buffer[to + aPos] <= 127 ? 0 : 255);
                            }
                            to += 4;
                            break;
                    }
                    break;

                case ePixelFormat.A8:
                    if (alphaPixels)
                    {
                        buffer[to] = (alphaPixel.red + alphaPixel.green + alphaPixel.blue) / 3;
                    }
                    else // !alphaPixels
                    {
                        buffer[to] = (pixel.red + pixel.green + pixel.blue) / 3;
                    }
                    if (alphaOnOff)
                    {
                        buffer[to] = (buffer[to] <= 127 ? 0 : 255);
                    }
                    to += 1;
                    break;
            }
        }

        if (invertFrame) fromImage -= (2 * imagePitch);
        if (alphaPixels)
        {
            if (invertFrame) fromAlpha -= (2 * alphaPitch);
        }
    }

    this.frameRetrieved = true;

    return frameRetrieved;
}

MediaPlayback.prototype.setAlphaChannel = function(playback)
{
    this.alphaPlayback = playback;
}

function MediaPlayback_OnImageLoad()
{
    this.container.onImageLoad();
}
// TODO: consider moving to a more appropriate file
function TextureArray(textureArray)
{
    this.textures = new Array(eTextureType.EnumCount);

    for (var i=0; i < this.textures.length; i++)
    {
        if (textureArray)
        {
            this.textures[i] = textureArray.textures[i].slice();
        }
        else
        {
            this.textures[i] = [];
        }
    }
}


StyleMgr.prototype = new AttributeContainer();
StyleMgr.prototype.constructor = StyleMgr;

function StyleMgr()
{
    AttributeContainer.call(this);
    this.className = "StyleMgr";
}

StyleMgr.prototype.eventPerformed = function(event, node)
{
    var result = node.stylesMap.getStyles(event.type);
    if (result.styles && result.enabled)
    {
        this.applyStyle(result.styles, result.target ? result.target : node);
    }
}

StyleMgr.prototype.applyStyle = function(style, node)
{
    node.styles.updateStyle(style);
}
GraphMgr.prototype = new AttributeContainer();
GraphMgr.prototype.constructor = GraphMgr;

function GraphMgr()
{
    AttributeContainer.call(this);
    this.className = "GraphMgr";
    
    this.renderContext = null;
    this.renderState = null;
    this.lightIndex = 0;
    this.material = null;
    this.dissolve = null;
    this.balloonTipLabel = null;
    this.drawTextures = true;
    this.textureArrayStack = new Stack(new TextureArray());
    this.projectionTextureArrayStack = new Stack(new TextureArray());
    this.labelIndex = 1;
    this.balloonTipLabelIndex = 1;
    this.styleMgr = new StyleMgr();
    
    this.name = new StringAttr("GraphMgr");
    
    this.registerAttribute(this.name, "name");
}

GraphMgr.prototype.setRenderContext = function(rc)
{
    this.renderContext = rc;
    this.renderState = new RenderState(rc);
}

GraphMgr.prototype.getAvailableLightIndex = function()
{
    return this.lightIndex++;
}

GraphMgr.prototype.getCurrentMaterial = function()
{
    return this.material;
}

GraphMgr.prototype.setCurrentMaterial = function(material)
{
    this.material = material;
}

GraphMgr.prototype.getCurrentDissolve = function()
{
    return this.dissolve;
}

GraphMgr.prototype.setCurrentDissolve = function(dissolve)
{
    this.dissolve = dissolve;
}

GraphMgr.prototype.getCurrentBalloonTipLabel = function()
{
    return this.balloonTipLabel;
}

GraphMgr.prototype.setCurrentBalloonTipLabel = function(balloonTipLabel)
{
    this.balloonTipLabel = balloonTipLabel;
}

GraphMgr.prototype.getDrawTextures = function()
{
    return this.drawTextures;
}

GraphMgr.prototype.setDrawTextures = function(drawTextures)
{
    this.drawTextures = drawTextures;
}

GraphMgr.prototype.getNextLabelIndex = function()
{
    return this.labelIndex++;
}

GraphMgr.prototype.getNextBalloonTipLabelIndex = function()
{
    return this.balloonTipLabelIndex++;    
}

GraphMgr.prototype.reset = function ()
{
    this.lightIndex = 0;
    this.labelIndex = 1;
    this.balloonTipLabelIndex = 1;
    this.setCurrentDissolve(null);
    this.setCurrentMaterial(null);
    this.setCurrentBalloonTipLabel(null);
    this.setDrawTextures(true);

    for (var i=0; i < gl_MaxLights; i++)
    {
        this.renderContext.enableLight(i, false);
    }
}
Node.prototype = new AttributeContainer();
Node.prototype.constructor = Node;

function Node()
{
    AttributeContainer.call(this);
    this.className = "Node";
    this.attrType = eAttrType.Node;
    
    this.children = [];
    this.parents = [];
    this.modificationCount = 0;
    this.thisModified = false;
    this.childModified = false;
    this.childrenModified = [];
    
    this.name = new StringAttr("");
    this.enabled = new BooleanAttr(true);
    this.orphan = new BooleanAttr(false);
    
    this.registerAttribute(this.name, "name");
    this.registerAttribute(this.enabled, "enabled");
    this.registerAttribute(this.orphan, "orphan");
}

Node.prototype.copyNode = function(clone, cloneChildren, pathSrc, pathClone)
{
    var clonedByThis = false;
    if (!clone)
    {
        if (!(clone = new Node()))
        {
            return -1;
        }

        clonedByThis = true;
    }

    // synchronize attributes
    clone.synchronize(this, false);

    // add source to path
    //pathSrc.addNode(this);
    pathSrc.push(this);

    // add clone to path
   // pathClone.AddNode(clone);
    pathClone.push(this);

    // if requested, clone children
    if (cloneChildren)
    {
      //  m_graphAccessLock.Lock("CNode::Clone");//(CReadWriteLock::eRWLockMode_Read);

        var pos;
        for (var i in this.children)
        {
            //pos = it - m_children.begin();
            pos = i - this.children.start();

            var childClone = null;
            if(!(i.getCreatedByParent()))
            {
                if (i.copyNode(childClone, cloneChildren, pathSrc, pathClone)) {
                    if (clonedByThis) {
                    }
                    return -1;
                }

                if (clone.getChildCount() > pos) {
                    clone.insertChild(childClone, pos);
                }
                else {
                    clone.addChild(childClone);
                }

                i.postCloneChild(childClone, pathSrc, pathClone);
            }
        else // created by parent -- clone child's children without allocating child
            {
                //childClone = clone.getChild(i - m_children.begin());
                childClone = clone.getChild(i - this.children.start());

                if (i.copyNode(childClone, cloneChildren, pathSrc, pathClone))
                {
                    if (clonedByThis)
                    {
                    }
                    return -1;
                }
            }
        }

        //m_graphAccessLock.Unlock();//(CReadWriteLock::eRWLockMode_Read);
    }

    this.postClone(clone, pathSrc, pathClone);

}
Node.prototype.searchTree = function(name,type,searchName,searchType,searchPredecessors,skipChild,skipParent,stopAt,matches)
{
    var names = [];
    var types = [];

    if (!(names.push(name))) return;
    if (!(types.push(type))) return;

    this.searchesTree(names, types, searchName, searchType, searchPredecessors, skipChild, skipParent,
        stopAt, matches);
}

Node.prototype.searchesTree = function(names,types,searchNames,searchTypes,searchPredecessors,skipChild,skipParent,stopAt,matches)
{
    // if this node matches any of the names and/or types, add it to the list
    var match = false;
    var nameMatch = false;
    var typeMatch = false;
    if (searchNames)
    {
        for (var i=0; i < names.size(); i++)
        {
            if (!(this.name == names[i]))
            {
                nameMatch = true;
                break;
            }
        }
    }
    if (searchTypes)
    {
        for (var i=0; i < types.size(); i++)
        {
            if (this.attrType == types[i])
            {
                typeMatch = true;
                break;
            }
        }
    }
    if (searchNames && searchTypes)
    {
        match = nameMatch && typeMatch;
    }
    else if (searchNames)
    {
        match = nameMatch;
    }
    else // searchTypes
    {
        match = typeMatch;
    }
    if (match)
    {
        if (!(matches.push(this))) return;
    }

    if (this == stopAt)
    {
        return;
    }

    // recurse on parent(s) if requested (with this set to skipChild)
    if (searchPredecessors)
    {
        for (var i=0; i < this.parents.size(); i++)
        {
            if (this.parents[i] != skipParent)
            {
                this.parents[i].searchesTree(names, types, searchNames, searchTypes, searchPredecessors,
                    this, null, stopAt, matches);
            }
        }
    }

    // recurse on children (with searchPredecessors set to false)
    for (var i=0; i < this.children.size(); i++)
    {
        if (this.children[i] != skipChild)
        {
            this.children[i].searchesTree(names, types, searchNames, searchTypes, false,
                null, null, stopAt, matches);
        }
    }
}
Node.prototype.setCreatedByParent = function(createdByParent)
{
    this.createdByParent = createdByParent;
}
Node.prototype.getCreatedByParent = function()
{
    return this.createdByParent;
}

Node.prototype.isNode = function()
{
    return true;
}

Node.prototype.addChild = function(child)
{
    this.children.push(child);
    
    this.incrementModificationCount();
    
    child.addParent(this);
}

Node.prototype.insertChild = function(child, before)
{
    this.children.splice(before, 0, child);
    
    this.incrementModificationCount();
    
    child.addParent(this);
}

Node.prototype.removeChild = function(child)
{
    this.children.splice(this.children.indexOf(child), 1);
    
    this.incrementModificationCount();
    
    child.removeParent(this);
}

Node.prototype.replaceChild = function(replacement, replacee)
{
    this.children.splice(this.children.indexOf(replacement), 1, replacee);
    replacement.removeParent(this);
    replacee.addParent(this);
}

Node.prototype.getChild = function(n)
{
    if (this.children.length > n)
    {
        return this.children[n];
    }
    
    return null;
}

Node.prototype.getNamedChild = function(name)
{
    for (var i=0; i < this.children.length; i++)
    {
        if (this.children[i].name.getValueDirect().join("") == name)
        {
            return this.children[i];
        }
    }
    
    return null;
}

Node.prototype.getChildCount = function()
{
    return this.children.length;
}

Node.prototype.getParent = function(n)
{
    if (this.parents.length > n)
    {
        return this.parents[n];
    }
    
    return null;
}

Node.prototype.getParentCount = function()
{
    return this.parents.length;
}

Node.prototype.addParent = function(parent)
{
    this.parents.push(parent);
}

Node.prototype.removeParent = function(parent)
{
    this.parents.splice(this.parents.indexOf(parent), 1);
}

Node.prototype.update = function(params, visitChildren)
{
    // only update if this and/or child has been modified
    if (!this.thisModified && !this.childModified)
    {
        // no need to update; inform parent this node is unmodified
        this.setChildModified(false, false);
        params.visited.push(this);
        return;
    }
    
    params.visited.push(this);
    
    if (visitChildren)
    {
        // call for all children
        for (var i=0; i < this.children.length; i++)
        {
            this.children[i].update(params, visitChildren);
        }
    }
    
    this.childModified = this.isChildModified();
}

Node.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        return;
    }

    if (visitChildren)
    {
        if (params.path)
        {
            // call for next node in path if next node in path is a child of this node
            if (params.path.length > params.pathIndex)
            {
                for (var i=0; i < this.children.length; i++)
                {
                    var next = params.path[params.pathIndex];

                    if (this.children[i] == next)
                    {
                        params.pathIndex++;
                        this.children[i].apply(directive, params, visitChildren);
                    }
                }
            }
        }
        else
        {
            // call for all children
            for (var i=0; i < this.children.length; i++)
            {
                this.children[i].apply(directive, params, visitChildren);
            }
        }
    }
}

Node.prototype.applyNode = function(node, directive, params, visitChildren)
{
    node.apply(directive, params, visitChildren);
}

Node.prototype.setModified = function()
{
    this.thisModified = true;

    // notify parent(s) of modification so that display lists can be maintained
    this.setChildModified(true, true);
}

Node.prototype.incrementModificationCount = function()
{
    this.modificationCount++;
    
    this.setModified();
}

Node.prototype.setChildModified = function(modified, recurse)
{
    // set on parent(s) of this; recurse if specified
    var parent = null;
    for (var i=0; i < this.parents.length; i++)
    {
        parent = this.parents[i];
        if (parent)
        {
            parent.childrenModified[this] = modified;
            parent.childModified = modified ? true : parent.isChildModified();
            if (recurse) parent.setChildModified(modified, recurse);
        }
    }
}

Node.prototype.isChildModified = function()
{
    for (var i in this.childrenModified)
    {
        if (this.childrenModified[i] == true) return true;
    }

    return false;
}
SGNode.prototype = new Node();
SGNode.prototype.constructor = SGNode;

function SGNode()
{
    Node.call(this);
    this.className = "SGNode";
    
    this.graphMgr = null;
    this.recordDisplayList = false;
    this.disableDisplayLists = false;
    this.displayListObj = null;
    
    this.enableDisplayList = new BooleanAttr(false);
    this.autoDisplayList = new BooleanAttr(false);
    this.updateDisplayList = new PulseAttr();
    
    this.registerAttribute(this.enableDisplayList, "enableDisplayList");
    this.registerAttribute(this.autoDisplayList, "autoDisplayList");
    this.registerAttribute(this.updateDisplayList, "updateDisplayList");
}

SGNode.prototype.setGraphMgr = function(graphMgr)
{
    this.graphMgr = graphMgr;
}

SGNode.prototype.update = function(params, visitChildren)
{
    // don't update if not enabled and not modified
    if (!(this.enabled.getValueDirect()) && !this.thisModified)
    {
        return;
    }

    // only update if this and/or child has been modified, and
    // display lists are enabled
    if (!this.thisModified && !this.childModified &&
         this.enableDisplayList.getValueDirect() == false &&
         this.autoDisplayList.getValueDirect() == false)
    {
        // no need to update; inform parent this node is unmodified
        this.setChildModified(false, false);
        params.visited.push(this);
        return;
    }
    
    params.visited.push(this);
    
    var subtreeModified = false;

    if (this.thisModified)
    {
        subtreeModified = true;
        this.thisModified = false;
    }

    if (this.childModified)
    {
        subtreeModified = true;
    }
    
    if (this.disableDisplayLists)
    {
        params.disableDisplayLists = true;
        this.disableDisplayLists = false;
    }
    
    // if the subtree has been modified, disable display list for this node
    if (subtreeModified)
    {
        this.enableDisplayList.setValueDirect(false);
        this.recordDisplayList = true; // re-record when (and if) list is re-enabled
    }
    
    // if using auto-display lists...
    // if the subtree has not been modified, enable display list for this node
    if (this.autoDisplayList.getValueDirect() && !subtreeModified)
    {
        this.enableDisplayList.setValueDirect(true);
    }

    // if there is already a current display list, or the manual override flag for disabling display lists is set, disable display list for this node
    if (params.displayListObj || params.disableDisplayLists)
    {
        this.enableDisplayList.setValueDirect(false);
    }

    // if enable display list is true, create display list object if not yet created and set recording to true
    if (this.enableDisplayList.getValueDirect())
    {
        if (!this.displayListObj)
        {
            this.createDisplayList();

            this.recordDisplayList = true;
        }
        
        // if recording is set to false, do not visit children
        if (!this.recordDisplayList)
        {
            visitChildren = false;
        }

        params.displayListObj = this.displayListObj;
    }
    
    if (visitChildren)
    {
        // call for all children
        for (var i=0; i < this.children.length; i++)
        {
            this.children[i].update(params, visitChildren);
        }
    }
    
    // if display list object was set to the update params, clear it
    if (params.displayListObj == this.displayListObj)
    {
        params.displayListObj = null;
    }
    
    this.childModified = this.isChildModified();
}

SGNode.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        return;
    }
    
    var useDisplayList = false;
    
    switch (directive)
    {
        case "render":
            {
                if (params.resetDisplayLists)
                {
                    this.recordDisplayList = true;
                }
                
                // determine if display list should be used; if a display list (from a parent node) is already operating, don't nest record or play...
                // this node's display list operations  will be recorded by the currently operating display list; also check manual override flag for disabling
                // display lists
                useDisplayList = this.enableDisplayList.getValueDirect() && 
                                 this.displayListObj &&
                                 !params.displayListObj && 
                                 !params.disableDisplayLists;
    
                if (useDisplayList)
                {
                    // set as current display list
                    params.displayListObj = this.displayListObj;
    
                    if (this.recordDisplayList)
                    {
                        // start recording render engine calls
                        this.displayListObj.record_begin();
                    }
                    else // !this.recordDisplayList
                    {
                        // playback render engine calls and do not visit children
                        this.displayListObj.play();
                        visitChildren = false;
                    }  
                }
            }
            break;
            
        case "rayPick":
            {
                params.currentNodePath.push(this);
            }
            break;
            
        default:
            {
                // call base-class implementation
                Node.prototype.apply.call(this, directive, params, visitChildren);
                return;
            }
            break;
    }
        
    if (visitChildren)
    {
        if (params.path)
        {
            // call for next node in path if next node in path is a child of this node
            if (params.path.length > params.pathIndex)
            {
                for (var i=0; i < this.children.length; i++)
                {
                    var next = params.path[params.pathIndex];

                    if (this.children[i] == next)
                    {
                        params.pathIndex++;
                        this.children[i].apply(directive, params, visitChildren);
                    }
                }
            }
        }
        else
        {
            // call for all children
            for (var i=0; i < this.children.length; i++)
            {
                this.children[i].apply(directive, params, visitChildren);
            }
        }
    }
    
    switch (directive)
    {
        case "render":
            {
                if (useDisplayList)
                {
                    if (this.recordDisplayList)
                    {
                        // stop recording render engine calls
                        this.displayListObj.record_end();
                        this.recordDisplayList = false;
                    }
    
                    // clear current display list
                    params.displayListObj = null;
                }
            }
            break;
            
        case "rayPick":
            {
                params.currentNodePath.pop();
            }
            break;
    }
}

SGNode.prototype.isRecordingDisplayList = function()
{
    if (this.graphMgr.renderContext.getDisplayList())
    {
        return true;
    }   
    
    return false; 
}

SGNode.prototype.createDisplayList = function()
{
    this.displayListObj = new DisplayListObj(this.graphMgr.renderContext);  
}

SGNode.prototype.deleteDisplayList = function()
{
    this.displayListObj = null;    
}

SGNode.prototype.enableDisplayListModified = function()
{   
}

function SGNode_EnableDisplayListModifiedCB(attribute, container)
{
    container.enableDisplayListModified();  
}

function SGNode_AutoDisplayListModifiedCB(attribute, container)
{    
}

function SGNode_UpdateDisplayListModifiedCB(attribute, container)
{
    container.disableDisplayLists = true;    
}

RenderableElement.prototype = new SGNode();
RenderableElement.prototype.constructor = RenderableElement;

function RenderableElement()
{
    SGNode.call(this);
    this.className = "RenderableElement";
    this.attrType = eAttrType.RenderableElement;
    
    this.bbox = new BBoxAttr();
    this.renderSequenceSlot = new NumberAttr(0);
    this.hasFocus = new TernaryAttr(0);
    this.selected = new TernaryAttr(0);
    this.styles = new StylesAttr();
    this.stylesMap = new StylesMapAttr();
    this.renderableElementStyle = new RenderableElementStyleAttr();
    this.renderedSlot = new NumberAttr(0);
    
    this.registerAttribute(this.bbox, "bbox");
    this.registerAttribute(this.renderSequenceSlot, "renderSequenceSlot");
    this.registerAttribute(this.hasFocus, "hasFocus");
    this.registerAttribute(this.selected, "selected");
    this.registerAttribute(this.styles, "styles");
    this.registerAttribute(this.stylesMap, "stylesMap");
    this.registerAttribute(this.renderableElementStyle, "renderableElementStyle");
    this.registerAttribute(this.renderedSlot, "renderedSlot");
}

RenderableElement.prototype.setRegistry = function(registry)
{
    this.stylesMap.setRegistry(registry);

    // call base-class implementation
    SGNode.prototype.setRegistry.call(this, registry);
}

RenderableElement.prototype.update = function(params, visitChildren)
{
    // call base-class implementation
    SGNode.prototype.update.call(this, params, visitChildren);
}

RenderableElement.prototype.apply = function(directive, params, visitChildren)
{
    // call base-class implementation
    SGNode.prototype.apply.call(this, directive, params, visitChildren);
}

ParentableMotionElement.prototype = new RenderableElement();
ParentableMotionElement.prototype.constructor = ParentableMotionElement;

function ParentableMotionElement()
{
    RenderableElement.call(this);
    this.className = "ParentableMotionElement";
    this.attrType = eAttrType.ParentableMotionElement;
    
    this.translationMatrix = new Matrix4x4();           // matrix representing this element's position translation
    this.rotationQuat = new Quaternion();               // quaternion for calculating rotation
    this.rotationMatrix = new Matrix4x4();              // matrix representing this element's rotation
    this.scaleMatrix = new Matrix4x4();                 // matrix representing this element's scale transformation
    this.pivotMatrix = new Matrix4x4();                 // matrix representing this element's pivot translation
    this.sectorTranslationMatrix = new Matrix4x4();		// matrix representing this element's sector position translation
    this.stackMatrix = new Matrix4x4();                 // current matrix from the scene graph matrix stack (GcTransform nodes)
    this.transformSimple = new Matrix4x4();             // after Update(), contains this element's transformations (translation/
    // rotation/scale/pivot)
    this.transformCompound = new Matrix4x4();           // after Update(), contains this element's transformations combined with 
    // parent's transformations (if any)
    this.sectorTransformSimple = new Matrix4x4();		// after Update(), contains this element's transformations (translation/
    // rotation/scale/pivot) for the current sector
    this.sectorTransformCompound = new Matrix4x4();     // after Update(), contains this element's transformations combined with 
    // parent's transformations (if any) for the current sector
                                                
    this.updatePosition = false;
    this.updateScale = false;
    this.updatePivot = false;
    this.updateSectorPosition = false;
    this.updateInheritance = false;
    this.inheritsPosition = true;
    this.inheritsRotation = true;
    this.inheritsScale = true;
    this.inheritsPivot = true;
    this.motionParent = null;
    
    this.position = new Vector3DAttr(0, 0, 0);
    this.rotation = new Vector3DAttr(0, 0, 0);
    this.scale = new Vector3DAttr(1, 1, 1);
    this.pivot = new Vector3DAttr(0, 0, 0);
    this.center = new Vector3DAttr(0, 0, 0);
    this.worldCenter = new Vector3DAttr(0, 0, 0);
    this.worldPosition = new Vector3DAttr(0, 0, 0);
    this.worldRotation = new Vector3DAttr(0, 0, 0);
    this.worldScale = new Vector3DAttr(1, 1, 1);
    this.screenPosition = new Vector3DAttr(0, 0, 0);
    this.sectorOrigin = new Vector3DAttr(0, 0, 0);
    this.sectorPosition = new Vector3DAttr(0, 0, 0);
    this.sectorWorldCenter = new Vector3DAttr(0, 0, 0);
    this.sectorWorldPosition = new Vector3DAttr(0, 0, 0);
    this.worldTransform = new Matrix4x4Attr(1, 0, 0, 0,
                                            0, 1, 0, 0,
                                            0, 0, 1, 0,
                                            0, 0, 0, 1);
    this.sectorWorldTransform = new Matrix4x4Attr(1, 0, 0, 0,
                                                  0, 1, 0, 0,
                                                  0, 0, 1, 0,
                                                  0, 0, 0, 1);
    this.parent = new StringAttr("");
    this.inheritPosition_X = new BooleanAttr(true);
    this.inheritPosition_Y = new BooleanAttr(true);
    this.inheritPosition_Z = new BooleanAttr(true);
    this.inheritRotation_X = new BooleanAttr(true);
    this.inheritRotation_Y = new BooleanAttr(true);
    this.inheritRotation_Z = new BooleanAttr(true);
    this.inheritScale_X = new BooleanAttr(true);
    this.inheritScale_Y = new BooleanAttr(true);
    this.inheritScale_Z = new BooleanAttr(true);
    this.inheritPivot_X = new BooleanAttr(true);
    this.inheritPivot_Y = new BooleanAttr(true);
    this.inheritPivot_Z = new BooleanAttr(true);
    
    this.position.addModifiedCB(ParentableMotionElement_PositionModifiedCB, this);
    this.rotation.addModifiedCB(ParentableMotionElement_RotationModifiedCB, this);
    this.scale.addModifiedCB(ParentableMotionElement_ScaleModifiedCB, this);
    this.pivot.addModifiedCB(ParentableMotionElement_PivotModifiedCB, this);
    this.sectorOrigin.addModifiedCB(ParentableMotionElement_SectorOriginModifiedCB, this);
    this.sectorPosition.addModifiedCB(ParentableMotionElement_SectorPositionModifiedCB, this);
    this.parent.addModifiedCB(ParentableMotionElement_ParentModifiedCB, this);
    this.inheritPosition_X.addModifiedCB(ParentableMotionElement_InheritanceModifiedCB, this);
    this.inheritPosition_Y.addModifiedCB(ParentableMotionElement_InheritanceModifiedCB, this);
    this.inheritPosition_Z.addModifiedCB(ParentableMotionElement_InheritanceModifiedCB, this);
    this.inheritRotation_X.addModifiedCB(ParentableMotionElement_InheritanceModifiedCB, this);
    this.inheritRotation_Y.addModifiedCB(ParentableMotionElement_InheritanceModifiedCB, this);
    this.inheritRotation_Z.addModifiedCB(ParentableMotionElement_InheritanceModifiedCB, this);
    this.inheritScale_X.addModifiedCB(ParentableMotionElement_InheritanceModifiedCB, this);
    this.inheritScale_Y.addModifiedCB(ParentableMotionElement_InheritanceModifiedCB, this);
    this.inheritScale_Z.addModifiedCB(ParentableMotionElement_InheritanceModifiedCB, this);
    this.inheritPivot_X.addModifiedCB(ParentableMotionElement_InheritanceModifiedCB, this);
    this.inheritPivot_Y.addModifiedCB(ParentableMotionElement_InheritanceModifiedCB, this);
    this.inheritPivot_Z.addModifiedCB(ParentableMotionElement_InheritanceModifiedCB, this);
    
    this.registerAttribute(this.position, "position");
    this.registerAttribute(this.rotation, "rotation");
    this.registerAttribute(this.scale, "scale");
    this.registerAttribute(this.pivot, "pivot");
    this.registerAttribute(this.center, "center");
    this.registerAttribute(this.worldCenter, "worldCenter");
    this.registerAttribute(this.worldPosition, "worldPosition");
    this.registerAttribute(this.worldRotation, "worldRotation");
    this.registerAttribute(this.worldScale, "worldScale");    
    this.registerAttribute(this.screenPosition, "screenPosition"); 
    this.registerAttribute(this.sectorOrigin, "sectorOrigin"); 
    this.registerAttribute(this.sectorPosition, "sectorPosition"); 
    this.registerAttribute(this.sectorWorldCenter, "sectorWorldCenter"); 
    this.registerAttribute(this.sectorWorldPosition, "sectorWorldPosition");
    this.registerAttribute(this.worldTransform, "worldTransform");
    this.registerAttribute(this.sectorWorldTransform, "sectorWorldTransform");
    this.registerAttribute(this.parent, "parent");
    this.registerAttribute(this.inheritPosition_X, "inheritPosition_X");
    this.registerAttribute(this.inheritPosition_Y, "inheritPosition_Y");
    this.registerAttribute(this.inheritPosition_Z, "inheritPosition_Z");
    this.registerAttribute(this.inheritRotation_X, "inheritRotation_X");
    this.registerAttribute(this.inheritRotation_Y, "inheritRotation_Y");
    this.registerAttribute(this.inheritRotation_Z, "inheritRotation_Z");
    this.registerAttribute(this.inheritScale_X, "inheritScale_X");
    this.registerAttribute(this.inheritScale_Y, "inheritScale_Y");
    this.registerAttribute(this.inheritScale_Z, "inheritScale_Z");
    this.registerAttribute(this.inheritPivot_X, "inheritPivot_X");
    this.registerAttribute(this.inheritPivot_X, "inheritPivot_Y");
    this.registerAttribute(this.inheritPivot_X, "inheritPivot_Z");
}

ParentableMotionElement.prototype.getTransform = function()
{
    var matrix = new Matrix4x4();
    matrix.loadMatrix(this.transformCompound);
    return matrix;
}

ParentableMotionElement.prototype.getSectorTransform = function()
{
    var matrix = new Matrix4x4();
    matrix.loadMatrix(this.sectorTransformCompound);
    return matrix;
}

ParentableMotionElement.prototype.update = function(params, visitChildren)
{
    if (this.updateInheritance)
    {
        this.updateInheritance = false;

        this.inheritsPosition = this.inheritPosition_X.getValueDirect() &&
        this.inheritPosition_Y.getValueDirect() &&
        this.inheritPosition_Z.getValueDirect();

        this.inheritsRotation = this.inheritRotation_X.getValueDirect() &&
        this.inheritRotation_Y.getValueDirect() &&
        this.inheritRotation_Z.getValueDirect();

        this.inheritsScale    = this.inheritScale_X.getValueDirect() &&
        this.inheritScale_Y.getValueDirect() &&
        this.inheritScale_Z.getValueDirect();

        this.inheritsPivot    = this.inheritPivot_X.getValueDirect() &&
        this.inheritPivot_Y.getValueDirect() &&
        this.inheritPivot_Z.getValueDirect();
    }
    
    // update this element's transformations (translation/rotation/scale/pivot)
    this.updateSimpleTransform();
    if (this.motionParent)
    {
        this.motionParent.update(params, false);
    }
    this.updateCompoundTransform();
    this.updateWorldMotionInfo();
    
    // call base-class implementation
    RenderableElement.prototype.update.call(this, params, visitChildren);
}

ParentableMotionElement.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        RenderableElement.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }
    
    switch (directive)
    {
        case "render":
        {
            var screen = toScreenSpace(this.sectorWorldPosition.getValueDirect(),
                params.viewMatrix, params.projMatrix, params.viewport);
            this.screenPosition.setValueDirect(screen.x, screen.y, screen.z);
        }
        break;
    }
    
    // call base-class implementation
    RenderableElement.prototype.apply.call(this, directive, params, visitChildren);
}

ParentableMotionElement.prototype.updateChildDisplayLists = function()
{
    for (var i=0; i < this.motionChildren.length; i++)
    {
        this.motionChildren[i].updateDisplayList.pulse();
    }
}

ParentableMotionElement.prototype.applyTransform = function()
{
    // TODO: if scaling factors are not 1, apply inverse scale before this transformation is
    // applied to avoid translation caused by scaling  
    
    // set transformation matrix
    this.graphMgr.renderContext.setMatrixMode(RC_MODELVIEW);
    this.graphMgr.renderContext.leftMultMatrix(this.sectorTransformCompound);
    this.graphMgr.renderContext.applyModelViewTransform();
    
// TODO: if invsere scale was applied, re-apply scale
}

ParentableMotionElement.prototype.updateSimpleTransform = function()
{
    var modified = false;
    
    if (this.updatePosition || this.updateRotation || this.updateScale || this.updatePivot)
    {
        var values;
        
        if (this.updatePosition)
        {
            this.updatePosition = false;
            
            values = this.position.getValueDirect();
            this.translationMatrix.loadTranslation(values.x, values.y, values.z);
            
            modified = true;
        }
        
        if (this.updateRotation)
        {
            this.updateRotation = false;
            
            values = this.rotation.getValueDirect();
            this.rotationQuat.loadXYZAxisRotation(values.x, values.y, values.z);
            this.rotationMatrix = this.rotationQuat.getMatrix();
            
            modified = true;
        }
        
        if (this.updateScale)
        {
            this.updateScale = false;
            
            values = this.scale.getValueDirect();
            this.scaleMatrix.loadScale(values.x, values.y, values.z);
            
            modified = true;
        }
        
        if (this.updatePivot)
        {
            this.updatePivot = false;
            
            values = this.pivot.getValueDirect();
            this.pivotMatrix.loadTranslation(-values.x, -values.y, -values.z);
            
            modified = true;
        }
        
        if (this.updateSectorPosition)
        {
            this.updateSectorPosition = false;
            
            values = this.sectorPosition.getValueDirect();
            this.sectorTranslationMatrix.loadTranslation(values.x, values.y, values.z);
            
            modified = true;
        }
        
        if (modified)
        {
            // pre-multiply pivot/scale/rotation since this is applied to both regular and sector transforms
            var psr = new Matrix4x4();
            psr.loadMatrix(this.pivotMatrix.multiply(this.scaleMatrix.multiply(this.rotationMatrix)));
    
            this.transformSimple.loadMatrix(psr.multiply(this.translationMatrix));
            this.sectorTransformSimple.loadMatrix(psr.multiply(this.sectorTranslationMatrix));
            
            // force any motion children to update their display lists
            this.updateChildDisplayLists();
        }
    }
}

ParentableMotionElement.prototype.updateCompoundTransform = function()
{
    this.transformCompound.loadMatrix(this.transformSimple);
    this.sectorTransformCompound.loadMatrix(this.sectorTransformSimple);
    
    if (this.motionParent)
    {
        if (this.inheritsPosition && this.inheritsRotation && this.inheritsScale && this.inheritsPivot)
        {
            this.transformCompound.loadMatrix(this.transformCompound.multiply(this.motionParent.transformCompound));
            this.sectorTransformCompound.loadMatrix(this.sectorTransformCompound.multiply(this.motionParent.sectorTransformCompound));
        }
        else // !m_inheritsPosition || !m_inheritsRotation || !m_inheritsScale || !m_inheritsPivot
        {
        // TODO
        }
    }
}

ParentableMotionElement.prototype.updateWorldMotionInfo = function()
{
    this.worldTransform.setValueDirect(this.transformCompound);
    this.sectorWorldTransform.setValueDirect(this.sectorTransformCompound);
    
    this.updateWorldCenter();
    this.updateWorldPosition();
    this.updateWorldRotation();
    this.updateWorldScale();
}

ParentableMotionElement.prototype.updateWorldCenter = function()
{
    var center = this.center.getValueDirect();
    center = this.transformCompound.transform(center.x, center.y, center.z, 1);
    this.worldCenter.setValueDirect(center.x, center.y, center.z);
    
    center = this.center.getValueDirect();
    center = this.sectorTransformCompound.transform(center.x, center.y, center.z, 1);
    this.sectorWorldCenter.setValueDirect(center.x, center.y, center.z);
}

ParentableMotionElement.prototype.updateWorldPosition = function()
{
    var position = this.transformCompound.transform(0, 0, 0, 1);
    this.worldPosition.setValueDirect(position.x, position.y, position.z);
    
    position = this.sectorTransformCompound.transform(0, 0, 0, 1);
    this.sectorWorldPosition.setValueDirect(position.x, position.y, position.z);
}

ParentableMotionElement.prototype.updateWorldRotation = function()
{
    var rotation = this.transformCompound.getRotationAngles();
    this.worldRotation.setValueDirect(rotation.x, rotation.y, rotation.z);
}

ParentableMotionElement.prototype.updateWorldScale = function()
{
    var scale = this.transformCompound.getScalingFactors();
    this.worldScale.setValueDirect(scale.x, scale.y, scale.z);
}

ParentableMotionElement.prototype.synchronizePosition = function()
{
    // synchronize position with sector position if necessary (don't sync if not necessary to avoid 
    // the circular dependency between position & sector position

    // get sector origin (use [0, 0, 0] for parented objects)
    var sectorOrigin = new Vector3D();
    if (this.motionParent)
    {
        sectorOrigin.x = 0;
        sectorOrigin.y = 0;
        sectorOrigin.z = 0;
    }
    else // !motionParent
    {
        sectorOrigin = this.sectorOrigin.getValueDirect();
    }
    
    // get sector position
    var sectorPosition = this.sectorPosition.getValueDirect();
    
    // get world position
    var position = new Vector3D();
    position.x = sectorOrigin.x + sectorPosition.x;
    position.y = sectorOrigin.y + sectorPosition.y;
    position.z = sectorOrigin.z + sectorPosition.z;
    
    // update position
    this.position.removeModifiedCB(ParentableMotionElement_PositionModifiedCB, this);
    this.position.setValueDirect(position.x, position.y, position.z);
    this.position.addModifiedCB(ParentableMotionElement_PositionModifiedCB, this);
    
    // flag a position update
    this.updatePosition = true;
}

ParentableMotionElement.prototype.synchronizeSectorPosition = function()
{
    // synchronize sector position with position if necessary (don't sync if not necessary to avoid 
    // the circular dependency between position & sector position
	
    // get sector origin (use [0, 0, 0] for parented objects)
    var sectorOrigin = new Vector3D;
    if (this.motionParent)
    {
        sectorOrigin.x = 0;
        sectorOrigin.y = 0;
        sectorOrigin.z = 0;
    }
    else // !motionParent
    {
        sectorOrigin = this.sectorOrigin.getValueDirect();
    }

    // get world position
    var position = this.position.getValueDirect();

    // get sector position
    var sectorPosition = new Vector3D;
    sectorPosition.x = position.x - sectorOrigin.x;
    sectorPosition.y = position.y - sectorOrigin.y;
    sectorPosition.z = position.z - sectorOrigin.z;

    // update sector position
    this.sectorPosition.removeModifiedCB(ParentableMotionElement_SectorPositionModifiedCB, this);
    this.sectorPosition.setValueDirect(sectorPosition.x, sectorPosition.y, sectorPosition.z);
    this.sectorPosition.addModifiedCB(ParentableMotionElement_SectorPositionModifiedCB, this);

    // flag a sector position update
    this.updateSectorPosition = true;
}

ParentableMotionElement.prototype.getDirectionVectors = function()
{
    var up = this.sectorTransformCompound.transform(0, 1, 0, 0);
    var right = this.sectorTransformCompound.transform(1, 0, 0, 0);
    var forward = this.sectorTransformCompound.transform(0, 0, 1, 0);
    
    return {
        up: up, 
        right: right, 
        forward: forward
    };
}

ParentableMotionElement.prototype.setMotionParent = function(parent)
{
    this.motionParent = parent;
    
    // set sector position to account for parenting
    this.synchronizeSectorPosition();       
}

ParentableMotionElement.prototype.updateChildDisplayLists = function()
{
    
}

function ParentableMotionElement_PositionModifiedCB(attribute, container)
{
    container.updatePosition = true;
    container.synchronizeSectorPosition();
    container.incrementModificationCount();
}

function ParentableMotionElement_RotationModifiedCB(attribute, container)
{
    container.updateRotation = true;
    container.incrementModificationCount();
}

function ParentableMotionElement_ScaleModifiedCB(attribute, container)
{
    container.updateScale = true;
    container.incrementModificationCount();
}

function ParentableMotionElement_PivotModifiedCB(attribute, container)
{
    container.updatePivot = true;
    container.incrementModificationCount();
}

function ParentableMotionElement_SectorOriginModifiedCB(attribute, container)
{
    container.synchronizeSectorPosition();
    container.incrementModificationCount();
}

function ParentableMotionElement_SectorPositionModifiedCB(attribute, container)
{
    container.updateSectorPosition = true;
    container.synchronizePosition();
    container.incrementModificationCount();
}

function ParentableMotionElement_ParentModifiedCB(attribute, container)
{
    container.setMotionParent(container.registry.find(attribute.getValueDirect().join("")));
}

function ParentableMotionElement_InheritanceModifiedCB(attribute, container)
{
    container.updateInheritance = true;
    container.incrementModificationCount();
}
function DirectiveParams()
{
    this.directive = null;
    this.path = null;
    this.pathIndex = 0;
    this.currentNodePath = new Stack();
    this.userData = null;
}

Directive.prototype = new AttributeContainer();
Directive.prototype.constructor = Directive;

function Directive()
{
    AttributeContainer.call(this);
    this.className = "Directive";
    this.attrType = eAttrType.Directive;
    
    this.name = new StringAttr("");
    this.enabled = new BooleanAttr(true);
    this.rootNode = new ReferenceAttr(null);
    
    this.registerAttribute(this.name, "name");
    this.registerAttribute(this.enabled, "enabled");
    this.registerAttribute(this.rootNode, "rootNode");
}
SGDirective.prototype = new Directive();
SGDirective.prototype.constructor = SGDirective;

function SGDirective()
{
    Directive.call(this);
    this.className = "SGDirective";
    
    this.graphMgr = null;
}

SGDirective.prototype.setGraphMgr = function(graphMgr)
{
    this.graphMgr = graphMgr;
}
UpdateParams.prototype = new DirectiveParams();
UpdateParams.prototype.constructor = UpdateParams();

function UpdateParams() // combined CUpdateParams & GtUpdateParams in this version
{
    DirectiveParams.call(this);
    
    this.pass = 0;
    this.timeIncrement = 0;
    this.visited = [];
    this.nextPass = [];
    this.displayListObj = null;
    this.disableDisplayLists = false;
}

UpdateDirective.prototype = new SGDirective();
UpdateDirective.prototype.constructor = UpdateDirective;

function UpdateDirective()
{
    SGDirective.call(this);
    this.className = "UpdateDirective";
    this.attrType = eAttrType.UpdateDirective;
    
    this.name.setValueDirect("UpdateDirective");
}

UpdateDirective.prototype.execute = function(root, params)
{
    root = root || this.rootNode.getValueDirect();
    
    // update (perform first pass)
    root.update(params, true);
    
    // update (perform subsequent passes while nextPass vector is not empty)
    while (params.nextPass.length > 0)
    {
        params.pass++;
        
        // get nodes to visit this pass
        var nodes = [];
        for (var i=0; i < params.nextPass.length; i++)
        {
            nodes[i] = params.nextPass[i];
        }
        params.nextPass.length = 0;
          
        for (var i=0; i < nodes.length; i++)
        {
            nodes[i].update(params, false);
        }
    }
    
    return params.visited;
}
Camera.prototype = new ParentableMotionElement();
Camera.prototype.constructor = Camera;

function Camera()
{
    ParentableMotionElement.call(this);
    this.className = "Camera";
    this.attrType = eAttrType.Camera;
    
    this.projectionMatrix = new Matrix4x4();
    this.viewport = new Viewport();
    this.updateNearDistance = false;
    this.updateFarDistance = false;
    this.updateClipPlanes = true;
    this.near = 0;
    this.far = 0;
    
    this.nearDistance = new NumberAttr(0);
    this.farDistance = new NumberAttr(0);
    this.viewVolume = new ViewVolumeAttr();
    //this.viewports
    this.sectorOriginUpdatesEnabled = new BooleanAttr(false);
    //this.updateSectorOrigin
    
    this.nearDistance.addModifiedCB(Camera_NearDistanceModifiedCB, this);
    this.farDistance.addModifiedCB(Camera_FarDistanceModifiedCB, this);
    
    this.registerAttribute(this.nearDistance, "nearDistance");
    this.registerAttribute(this.farDistance, "farDistance");
    this.registerAttribute(this.viewVolume, "viewVolume");
}

Camera.prototype.update = function(params, visitChildren)
{
    if (this.updateNearDistance)
    {
        this.updateNearDistance = false;
        
        this.near = this.nearDistance.getValueDirect();
        
        this.updateClipPlanes = true;
    }
    
    if (this.updateFarDistance)
    {
        this.updateFarDistance = false;
        
        this.far = this.farDistance.getValueDirect();
        
        this.updateClipPlanes = true;
    }
    
    // call base-class implementation
    ParentableMotionElement.prototype.update.call(this, params, visitChildren);
}

Camera.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }

    switch (directive)
    {
        case "render":
            {
                this.applyTransform();

                params.projMatrix.loadMatrix(this.projectionMatrix);
                params.viewMatrix.loadMatrix(this.sectorTransformCompound);
                params.viewMatrix.invert(); // put in view-space
            }
            break;

        case "rayPick":
            {
                // if a specific camera is specified in the ray pick params,
                // make sure this is the specified camera
                if (!params.camera || params.camera == this)
                {
                    var ray = this.getViewSpaceRay(params.viewport, params.clickPoint);
                    params.rayOrigin = ray.origin;
                    params.rayDir = ray.direction;
                    params.currentCamera = this;
                    params.nearDistance = this.nearDistance.getValueDirect();
                    params.farDistance = this.farDistance.getValueDirect();
                    params.viewMatrix.loadMatrix(this.sectorTransformCompound);
                    params.viewMatrix.invert(); // put in view-space
                }
            }
            break;

        case "bbox":
            {
                // user wants bbox in view space; set view matrix so that geometry nodes 
                // can multiply world matrix by view matrix to get worldView matrix
                params.viewMatrix.loadMatrix(this.sectorTransformCompound);
                params.viewMatrix.invert(); // put in view-space
            }
            break;
    }

    // call base-class implementation
    ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);
}

Camera.prototype.applyTransform = function()
{
    var matrix = new Matrix4x4();
    matrix.loadMatrix(this.sectorTransformCompound);
    matrix.invert();

    this.graphMgr.renderContext.setMatrixMode(RC_MODELVIEW);
    this.graphMgr.renderContext.loadMatrix(matrix);
    this.graphMgr.renderContext.applyModelViewTransform();
}

function Camera_NearDistanceModifiedCB(attribute, container)
{
    container.updateNearDistance = true;
    container.incrementModificationCount();
}

function Camera_FarDistanceModifiedCB(attribute, container)
{
    container.updateFarDistance = true;
    container.incrementModificationCount();
}
OrthographicCamera.prototype = new Camera();
OrthographicCamera.prototype.constructor = OrthographicCamera;

function OrthographicCamera()
{
    Camera.call(this);
    this.className = "OrthographicCamera";
    this.attrType = eAttrType.OrthographicCamera;
    
    this.updateWidth = false;
    
    this.width = new NumberAttr(2);
    
    this.width.addModifiedCB(OrthographicCamera_WidthModifiedCB, this);
    
    this.registerAttribute(this.width, "width");
}

OrthographicCamera.prototype.update = function(params, visitChildren)
{
    if (this.updateWidth)
    {
        this.updateWidth = false;

        this.updateClipPlanes = true;
    }
    
    // call base-class implementation
    Camera.prototype.update.call(this, params, visitChildren);
}

OrthographicCamera.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        Camera.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }
    
    switch (directive)
    {
    case "render":
        {
            if (!this.viewport.equals(params.viewport))
            {
                this.viewport = params.viewport;
                this.updateClipPlanes = true;  
            }
            
            if (this.updateClipPlanes)
            {
                this.updateClipPlanes = false;
                
                this.setClipPlanes();
            }
            
            this.applyOrthographicTransform();
        }
        break;
    }
    
    // call base-class implementation
    Camera.prototype.apply.call(this, directive, params, visitChildren);
}

OrthographicCamera.prototype.setClipPlanes = function()
{
    var width = this.width.getValueDirect();
    var height = width * this.viewport.height / this.viewport.width;
    
    this.top = height / 2;
    this.bottom = -this.top;
    this.right = width / 2;
    this.left = -this.right;
    
    this.projectionMatrix.loadMatrix(this.graphMgr.renderContext.orthographicMatrixLH(this.left, this.right,
        this.top, this.bottom, this.near, this.far));
        
    // update view-volume attribute
    var viewVolume = new ViewVolume();
    viewVolume.setOrthographic(this.left, this.right, this.top, this.bottom, this.near, this.far);
    this.viewVolume.setValueDirect(viewVolume.left, viewVolume.right, viewVolume.top, viewVolume.bottom,
        viewVolume.near, viewVolume.far);    
}

OrthographicCamera.prototype.applyOrthographicTransform = function()
{
    this.graphMgr.renderContext.projectionMatrixStack.top().loadMatrix(this.projectionMatrix);
    this.graphMgr.renderContext.applyProjectionTransform();
}

OrthographicCamera.prototype.getViewSpaceRay = function(viewport, clickPoint)
{
    // normalize click coordinates so they span [-1, 1] on each axis
    var normX =  ((clickPoint.x - viewport.x) / viewport.width  * 2 - 1);
    var normY = -((clickPoint.y - viewport.y) / viewport.height * 2 - 1);

    // determine the width/2 of the visible portion of the x axis on the 
    // far clipping plane
    var farX  = (this.right - this.left) / 2;

    // determine the height/2 of the visible portion of the y axis on the
    // far clipping plane
    var farY  = (this.top - this.bottom) / 2;

    // set ray origin as point within visible portion of x, y on the 
    // near clipping plane corresponding to the normalized screen coordinates
    var origin = new Vector3D(normX * farX, normY * farY, this.near);

    // set ray direction as point within visible portion of x, y on the 
    // far clipping plane corresponding to the normalized screen coordinates
    //rayDir = CVector3Df(normX * farX, normY * farY, m_far);
    var direction = new Vector3D(0, 0, 1);
    
    return { origin: origin, direction: direction };  
}

function OrthographicCamera_WidthModifiedCB(attribute, container)
{
    container.updateWidth = true;
    container.incrementModificationCount();
}
PerspectiveCamera.prototype = new Camera();
PerspectiveCamera.prototype.constructor = PerspectiveCamera;

function PerspectiveCamera()
{
    Camera.call(this);
    this.className = "PerspectiveCamera";
    this.attrType = eAttrType.PerspectiveCamera;
    
    this.updateZoom = false;
    this.fovyRadians = 0;
    this.left = 0;
    this.right = 0;
    this.top = 0;
    this.bottom = 0;
    
    this.zoom = new NumberAttr(0);
    
    this.zoom.addModifiedCB(PerspectiveCamera_ZoomModifiedCB, this);
    
    this.registerAttribute(this.zoom, "zoom");
}

PerspectiveCamera.prototype.update = function(params, visitChildren)
{
    if (this.updateZoom)
    {
        this.updateZoom = false;
        
        this.fovyRadians = 2 * Math.atan2(1, this.zoom.getValueDirect());

        this.updateClipPlanes = true;
    }
    
    // call base-class implementation
    Camera.prototype.update.call(this, params, visitChildren);
}

PerspectiveCamera.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        Camera.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }
    
    switch (directive)
    {
    case "render":
        {
            if (!this.viewport.equals(params.viewport))
            {
                this.viewport = params.viewport;
                this.updateClipPlanes = true;  
            }
            
            if (this.updateClipPlanes)
            {
                this.updateClipPlanes = false;
                
                this.setClipPlanes();
            }
            
            this.applyPerspectiveTransform();
        }
        break;
    }
    
    // call base-class implementation
    Camera.prototype.apply.call(this, directive, params, visitChildren);
}

PerspectiveCamera.prototype.setClipPlanes = function()
{
    this.top = Math.tan(this.fovyRadians / 2) * this.near;
    this.bottom = -this.top;
    this.right = this.top * (this.viewport.width / this.viewport.height);
    this.left = -this.right;
    
    this.projectionMatrix.loadMatrix(this.graphMgr.renderContext.perspectiveMatrixLH(this.left, this.right,
        this.top, this.bottom, this.near, this.far));
        
    // update view-volume attribute
    var viewVolume = new ViewVolume();
    viewVolume.setPerspective(this.fovyRadians, this.viewport.width / this.viewport.height, this.near, this.far);
    this.viewVolume.setValueDirect(viewVolume.left, viewVolume.right, viewVolume.top, viewVolume.bottom,
        viewVolume.near, viewVolume.far);    
}

PerspectiveCamera.prototype.applyPerspectiveTransform = function()
{
    this.graphMgr.renderContext.projectionMatrixStack.top().loadMatrix(this.projectionMatrix);
    this.graphMgr.renderContext.applyProjectionTransform();
}

PerspectiveCamera.prototype.getViewSpaceRay = function(viewport, clickPoint)
{
    // normalize click coordinates so they span [-1, 1] on each axis
    var normX =  ((clickPoint.x - viewport.x) / viewport.width  * 2 - 1);
    var normY = -((clickPoint.y - viewport.y) / viewport.height * 2 - 1);

    // get vertical field of view in radians
    var fovY = this.fovyRadians;

    // get horizontal field of view in radians
    var fovX = 2 * Math.atan(viewport.width / viewport.height * Math.tan(fovY / 2));

    // determine the width/2 of the visible portion of the x axis on the 
    // far clipping plane
    var farX  = Math.tan(fovX / 2) * this.far;

    // determine the height/2 of the visible portion of the y axis on the
    // far clipping plane
    var farY  = Math.tan(fovY / 2) * this.far;

    // set ray origin
    var origin = new Vector3D(0, 0, 0);

    // set ray direction as point within visible portion of x, y on the 
    // far clipping plane corresponding to the normalized screen coordinates
    var direction = new Vector3D(normX * farX, normY * farY, this.far);
    
    return { origin: origin, direction: direction };  
}

function PerspectiveCamera_ZoomModifiedCB(attribute, container)
{
    container.updateZoom = true;
    container.incrementModificationCount();
}
Light.prototype = new ParentableMotionElement();
Light.prototype.constructor = Light;

function Light()
{
    ParentableMotionElement.call(this);
    this.className = "Light";
    this.attrType = eAttrType.Light;
    
    this.updateAmbient = true;
    this.updateDiffuse = true;
    this.updateSpecular = true;
    this.updateConstantAttenuation = true;
    this.updateLinearAttenuation = true;
    this.updateQuadraticAttenuation = true;
    this.lightDesc = new LightDesc();
    this.lightDesc.validMembersMask = 0;
    this.lightIndex = 0;
    this.setLightDesc = false;
    
    this.ambient = new ColorAttr(0, 0, 0, 1);
	this.diffuse = new ColorAttr(1, 1, 1, 1);
	this.specular = new ColorAttr(1, 1, 1, 1);
	this.constantAttenuation = new NumberAttr(1);
	this.linearAttenuation = new NumberAttr(0);
	this.quadraticAttenuation = new NumberAttr(0);
    this.shadowCaster = new BooleanAttr(false);

    this.ambient.addModifiedCB(Light_AmbientModifiedCB, this);
    this.diffuse.addModifiedCB(Light_DiffuseModifiedCB, this);
    this.specular.addModifiedCB(Light_SpecularModifiedCB, this);
    this.constantAttenuation.addModifiedCB(Light_ConstantAttenuationModifiedCB, this);
    this.linearAttenuation.addModifiedCB(Light_LinearAttenuationModifiedCB, this);
    this.quadraticAttenuation.addModifiedCB(Light_QuadraticAttenuationModifiedCB, this);

    this.registerAttribute(this.ambient, "ambient");
    this.registerAttribute(this.diffuse, "diffuse");
    this.registerAttribute(this.specular, "specular");
    this.registerAttribute(this.constantAttenuation, "constantAttenuation");
    this.registerAttribute(this.linearAttenuation, "linearAttenuation");
    this.registerAttribute(this.quadraticAttenuation, "quadraticAttenuation");
    this.registerAttribute(this.shadowCaster, "shadowCaster");
}

Light.prototype.setGraphMgr = function(graphMgr)
{
    this.lightIndex = graphMgr.getAvailableLightIndex();
    
    // call base-class implementation
    ParentableMotionElement.prototype.setGraphMgr.call(this, graphMgr);
}

Light.prototype.update = function(params, visitChildren)
{  
    if (this.updateAmbient)
    {
        this.updateAmbient = false;

        this.lightDesc.ambient.copy(this.ambient.getValueDirect());
        this.lightDesc.validMembersMask |= LIGHTDESC_AMBIENT_BIT;
    }

    if (this.updateDiffuse)
    {
        this.updateDiffuse = false;

        this.lightDesc.diffuse.copy(this.diffuse.getValueDirect());
        this.lightDesc.validMembersMask |= LIGHTDESC_DIFFUSE_BIT;
    }

    if (this.updateSpecular)
    {
        this.updateSpecular = false;

        this.lightDesc.specular.copy(this.specular.getValueDirect());
        this.lightDesc.validMembersMask |= LIGHTDESC_SPECULAR_BIT;
    }

    if (this.updateConstantAttenuation)
    {
        this.updateConstantAttenuation = false;

        this.lightDesc.constantAttenuation = this.constantAttenuation.getValueDirect();
        this.lightDesc.validMembersMask |= LIGHTDESC_CONSTANT_ATT_BIT;
    }

    if (this.updateLinearAttenuation)
    {
        this.updateLinearAttenuation = false;

        this.lightDesc.linearAttenuation = this.linearAttenuation.getValueDirect();
        this.lightDesc.validMembersMask |= LIGHTDESC_LINEAR_ATT_BIT;
    }

    if (this.updateQuadraticAttenuation)
    {
        this.updateQuadraticAttenuation = false;

        this.lightDesc.quadraticAttenuation = this.quadraticAttenuation.getValueDirect();
        this.lightDesc.validMembersMask |= LIGHTDESC_QUADRATIC_ATT_BIT;
    }

    if (this.lightDesc.validMembersMask)
    {
        this.setLightDesc = true;
    }
    
    // ensure continued update (lights are transformed by view matrix)
    this.setModified();
    
    // call base-class implementation
    ParentableMotionElement.prototype.update.call(this, params, visitChildren);
}

Light.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        switch (directive)
        {
        case "render":
            {
                this.setLightEnabled();
            }
            break;
        }
        
        // call base-class implementation
        ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }
    
    switch (directive)
    {
    case "render":
        {
            if (this.setLightDesc)
            {
                this.setLightDesc = false;
                
                this.applyLightDesc();
            }

            this.setLightEnabled();   
        }
        break;
    }
    
    // call base-class implementation
    ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);
}

Light.prototype.applyLightDesc = function()
{
    this.graphMgr.renderContext.setLight(this.lightIndex, this.lightDesc);  
}

Light.prototype.setLightEnabled = function()
{
    this.graphMgr.renderContext.enableLight(this.lightIndex, this.enabled.getValueDirect() ? 1 : 0);
}

function Light_AmbientModifiedCB(attribute, container)
{
    container.updateAmbient = true;
    container.incrementModificationCount();
}

function Light_DiffuseModifiedCB(attribute, container)
{
    container.updateDiffuse = true;
    container.incrementModificationCount();
}

function Light_SpecularModifiedCB(attribute, container)
{
    container.updateSpecular = true;
    container.incrementModificationCount();
}

function Light_ConstantAttenuationModifiedCB(attribute, container)
{
    container.updateConstantAttenuation = true;
    container.incrementModificationCount();
}
    
function Light_LinearAttenuationModifiedCB(attribute, container)
{
    container.updateLinearAttenuation = true;
    container.incrementModificationCount();
}

function Light_QuadraticAttenuationModifiedCB(attribute, container)
{
    container.updateQuadraticAttenuation = true;
    container.incrementModificationCount();
}

DirectionalLight.prototype = new Light();
DirectionalLight.prototype.constructor = DirectionalLight;

function DirectionalLight()
{
    Light.call(this);
    this.className = "DirectionalLight";
    this.attrType = eAttrType.DirectionalLight;
    
    this.lightDesc.type = "directional";
}

DirectionalLight.prototype.update = function(params, visitChildren)
{
    this.validMembersMask = 0;
    
    // call base-class implementation
    Light.prototype.update.call(this, params, visitChildren);
}

DirectionalLight.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        Light.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }
    
    switch (directive)
    {
    case "render":
        {      
            var direction = this.sectorTransformCompound.transform(0, 0, 1, 0);
            this.lightDesc.direction.copy(direction);
            this.lightDesc.validMembersMask |= LIGHTDESC_DIRECTION_BIT; 
            
            // must re-update direction every frame because OpenGL transforms
            // light direction by the current modelView matrix
            this.setLightDesc = true;
        }
        break;
    }
    
    // call base-class implementation
    Light.prototype.apply.call(this, directive, params, visitChildren);
}
PointLight.prototype = new Light();
PointLight.prototype.constructor = PointLight;

function PointLight()
{
    Light.call(this);
    this.className = "PointLight";
    this.attrType = eAttrType.PointLight;
    
    this.lightDesc.type = "point";
    
    this.updateRange = false;
    
    this.range = new NumberAttr();
    
    this.range.addModifiedCB(PointLight_RangeModifiedCB, this);

    this.registerAttribute(this.range, "range");
}

PointLight.prototype.update = function(params, visitChildren)
{
    this.validMembersMask = 0;
    
    if (this.updateRange)
    {
        this.updateRange = false;

        this.lightDesc.range = this.range.getValueDirect();
        this.lightDesc.validMembersMask |= LIGHTDESC_RANGE_BIT;
    }
    
    // call base-class implementation
    Light.prototype.update.call(this, params, visitChildren);
}

PointLight.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        Light.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }
    
    switch (directive)
    {
    case "render":
        {      
            var position = this.sectorTransformCompound.transform(0, 0, 0, 1);
            this.lightDesc.position.copy(position);
            this.lightDesc.validMembersMask |= LIGHTDESC_POSITION_BIT;

            // signifies this is a point light (not a spot light)
            this.lightDesc.outerConeDegrees = 180;
            this.lightDesc.validMembersMask |= LIGHTDESC_OUTER_CONE_DEG_BIT;
            
            // must re-update position every frame because OpenGL transforms
            // light position by the current modelView matrix
            this.setLightDesc = true;
        }
        break;
    }
    
    // call base-class implementation
    Light.prototype.apply.call(this, directive, params, visitChildren);
}

function PointLight_RangeModifiedCB(attribute, container)
{
    container.updateRange = true;
    container.incrementModificationCount();
}
GlobalIllumination.prototype = new SGNode();
GlobalIllumination.prototype.constructor = GlobalIllumination;

function GlobalIllumination()
{
    SGNode.call(this);
    this.className = "GlobalIllumination";
    this.attrType = eAttrType.GlobalIllumination;
    
    this.updateAmbient = true;
    this.setGlobalIllumination = false;
    
    this.ambient = new ColorAttr(0, 0, 0, 1);
    
    this.ambient.addModifiedCB(GlobalIllumination_AmbientModifiedCB, this);
    
    this.registerAttribute(this.ambient, "ambient");
}

GlobalIllumination.prototype.update = function(params, visitChildren)
{
    if (this.updateAmbient)
    {
        this.updateAmbient = false;
        
        this.setGlobalIllumination = true;
    }
    
    // call base-class implementation
    SGNode.prototype.update.call(this, params, visitChildren);
}

GlobalIllumination.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }
    
    switch (directive)
    {
    case "render":
        {
            if (this.setGlobalIllumination)
            {
                this.setGlobalIllumination = false;
                
                this.applyGlobalIllumination();
            }
        }
        break;
    }
    
    // call base-class implementation
    SGNode.prototype.apply.call(this, directive, params, visitChildren);
}

GlobalIllumination.prototype.applyGlobalIllumination = function()
{
    this.graphMgr.renderContext.setGlobalIllumination(this.ambient.getValueDirect());
}

function GlobalIllumination_AmbientModifiedCB(attribute, container)
{
    container.updateAmbient = true;
    container.incrementModificationCount();
}
Group.prototype = new SGNode();
Group.prototype.constructor = Group;

function Group()
{
    SGNode.call(this);
    this.className = "Group";
    this.attrType = eAttrType.Group;
    
    this.proxyChildAttrs = new BooleanAttr(false);
    
    this.proxyChildAttrs.addModifiedCB(Group_ProxyChildAttrsModifiedCB, this);
    
    this.registerAttribute(this.proxyChildAttrs, "proxyChildAttrs");
    
    this.enableDisplayList.addModifiedCB(Group_EnableDisplayListModifiedCB, this);
    
    // enable auto-display lists
    this.autoDisplayList.setValueDirect(true);
    this.autoDisplayList.addModifiedCB(Group_AutoDisplayListModifiedCB, this);
}

Group.prototype.addChild = function(child)
{
	if (this.proxyChildAttrs.getValueDirect() == true)
    {
        this.proxyAttributes(child);
    }

    var autoDL = child.getAttribute("autoDisplayList");
    if (autoDL)
    {
        autoDL.addTarget(this.autoDisplayList, eAttrSetOp.AND);
        autoDL.addModifiedCB(Group_ChildAutoDisplayListModifiedCB, this);
    }
	else // cannot use auto display lists because child doesn't support them
	{
		this.autoDisplayList.setValueDirect(false);
	}

    // call base-class implementation
    SGNode.prototype.addChild.call(this, child);
}

Group.prototype.insertChild = function(child, before)
{
    if (this.proxyChildAttrs.getValueDirect() == true)
    {
        this.proxyAttributes(child);
    }

    var autoDL = child.getAttribute("autoDisplayList");
    if (autoDL)
    {
        autoDL.addTarget(this.autoDisplayList, eAttrSetOp.AND);
        autoDL.addModifiedCB(Group_ChildAutoDisplayListModifiedCB, this);
    }
	else // cannot use auto display lists because child doesn't support them
	{
		this.autoDisplayList.setValueDirect(false);
	}

    // call base-class implementation
    SGNode.prototype.insertChild.call(this, child, before);
}
    
Group.prototype.removeChild = function(child)
{
    if (this.proxyChildAttrs.getValueDirect() == true)
    {
        //UnProxyAttributes(child);
        this.synchronizeProxiedAttributes();
    }

    var autoDL = child.getAttribute("autoDisplayList");
    if (autoDL)
    {
        autoDL.removeTarget(this.autoDisplayList, eAttrSetOp.AND);
        autoDL.removeModifiedCB(Group_ChildAutoDisplayListModifiedCB, this);
    }

    // call base-class implementation
    return SGNode.prototype.removeChild.call(this, child);
}

Group.prototype.replaceChild = function(replacement, replacee)
{
    if (this.proxyChildAttrs.getValueDirect() == true)
    {
        //UnProxyAttributes(replacee);
        this.proxyAttributes(replacement);
        this.synchronizeProxiedAttributes(); // replacement might not be the same type as replacee
    }

	var autoDL = replacee.getAttribute("autoDisplayList");
    if (autoDL)
    {
        autoDL.removeTarget(this.autoDisplayList, eAttrSetOp.AND);
        autoDL.removeModifiedCB(Group_ChildAutoDisplayListModifiedCB, this);
    }
    
    autoDL = replacement.getAttribute("autoDisplayList");
    if (autoDL)
    {
    	autoDL.addTarget(this.autoDisplayList, eAttrSetOp.AND);
    	autoDL.addModifiedCB(Group_ChildAutoDisplayListModifiedCB, this);	
    }
    else // cannot use auto display lists because replacement doesn't support them
	{
		this.autoDisplayList.setValueDirect(false);
	}

    // call base-class implementation
    return SGNode.prototype.replaceChild.call(this, replacement, replacee);
}

Group.prototype.update = function(params, visitChildren)
{
    // call base-class implementation
    SGNode.prototype.update.call(this, params, visitChildren);
}

Group.prototype.apply = function(directive, params, visitChildren)
{
    // call base-class implementation
    SGNode.prototype.apply.call(this, directive, params, visitChildren);
}

Group.prototype.proxyChildAttrsModified = function()
{
    // TODO
}

Group.prototype.childAutoDisplayListModified = function()
{
    // check the state of all children's autoDisplayList.  If all are set to true, set this node's autoDisplayList to true; if any
    // are set to false, set this node's autoDisplayList to false (cannot rely solely upon the fact that the children's autoDisplayList
    // attribute are 'AND' targeted to this node's autoDisplayList, because as soon as this node's autoDisplayList is false, 'AND' with
    // all children will still be false, even if all children are true; that portion of the algorithm handles the case when a child with
    // autoDisplayList set to false is added to this; this step handles the other portion of the algorithm).
    var autoDL = true;
    for (var i=0; i < this.children.length; i++)
    {
        childAutoDL = this.children[i].getAttribute("autoDisplayList");
        if (childAutoDL)
        {
            autoDL &= childAutoDL.getValueDirect();
            if (!autoDL)
            {
                break;
            }
        }
    }

    this.autoDisplayList.setValueDirect(autoDL);
}

function Group_ProxyChildAttrsModifiedCB(attribute, container)
{
    container.proxyChildAttrsModified();
}

function Group_ProxiedAttrModifiedCB(attribute, data)
{
    data.group.proxiedAttrModified(data.proxiedNodeTypeString, attribute, data.proxiedAttrName);
}

function Group_EnableDisplayListModifiedCB(attribute, container)
{
    var enableDL = attribute.getValueDirect();    
}

function Group_AutoDisplayListModifiedCB(attribute, container)
{
    var autoDL = attribute.getValueDirect();
    if (!autoDL && container)
    {
        if (container.enableDisplayList.getValueDirect() == true)
        {
            container.enableDisplayList.setValueDirect(attribute.getValueDirect());
        }
    }  
}

function Group_ChildAutoDisplayListModifiedCB(attribute, container)
{
    container.childAutoDisplayListModified();
}


Isolator.prototype = new Group();
Isolator.prototype.constructor = Isolator;

function Isolator()
{
    Group.call(this);
    this.className = "Isolator";
    this.attrType = eAttrType.Isolator;
    
    this.updateIsolateTransforms = true;
    this.updateIsolateLights = true;
    this.updateIsolateMaterials = true;
    this.updateIsolateTextures = true;
    this.updateIsolateFog = true;
    this.updateIsolateClipPlanes = true;
    
    this.isolateTransforms = new BooleanAttr(false);
    this.isolateLights = new BooleanAttr(false);
    this.isolateMaterials = new BooleanAttr(false);
    this.isolateTextures = new BooleanAttr(false);
    this.isolateDissolves = new BooleanAttr(false);
    this.isolateGlobalIlluminations = new BooleanAttr(false);
    this.isolateLightModels = new BooleanAttr(false);
    this.isolateFog = new BooleanAttr(false);
    this.isolateClipPlanes = new BooleanAttr(false);
    this.isolateRenderModes = new BooleanAttr(false);

    this.isolateTransforms.addModifiedCB(Isolator_IsolateTransformsModifiedCB, this);
    this.isolateLights.addModifiedCB(Isolator_IsolateLightsModifiedCB, this);
    this.isolateMaterials.addModifiedCB(Isolator_IsolateMaterialsModifiedCB, this);
    this.isolateTextures.addModifiedCB(Isolator_IsolateTexturesModifiedCB, this);
    this.isolateFog.addModifiedCB(Isolator_IsolateFogModifiedCB, this);
    this.isolateClipPlanes.addModifiedCB(Isolator_IsolateClipPlanesModifiedCB, this);
    
    this.registerAttribute(this.isolateTransforms, "isolateTransforms");
    this.registerAttribute(this.isolateLights, "isolateLights");
    this.registerAttribute(this.isolateMaterials, "isolateMaterials");
    this.registerAttribute(this.isolateTextures, "isolateTextures");
    this.registerAttribute(this.isolateDissolves, "isolateDissolves");
    this.registerAttribute(this.isolateGlobalIlluminations, "isolateGlobalIlluminations");
    this.registerAttribute(this.isolateLightModels, "isolateLightModels");
    this.registerAttribute(this.isolateFog, "isolateFog");
    this.registerAttribute(this.isolateClipPlanes, "isolateClipPlanes");
    this.registerAttribute(this.isolateRenderModes, "isolateRenderModes");
}

Isolator.prototype.update = function(params, visitChildren)
{
    // call base-class implementation
    Group.prototype.update.call(this, params, visitChildren);
}

Isolator.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        Group.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }

    var isolateTransforms = this.isolateTransforms.getValueDirect();
    var isolateTextures = this.isolateTextures.getValueDirect();
    var isolateDissolves = this.isolateDissolves.getValueDirect();
    var isolateClipPlanes = this.isolateClipPlanes.getValueDirect();

    var lastDissolve = 0;
    var dissolveNode = null;

    var lastProjMatrix = null;
    var lastViewMatrix = null;
    var lastWorldMatrix = null;
    
    switch (directive)
    {
        case "render":
            {
                this.pushIsolatedStates();

                // TODO

                // push transforms
                if (isolateTransforms)
                {
                    lastProjMatrix = params.projMatrix;
                    lastViewMatrix = params.viewMatrix;
                    lastWorldMatrix = params.worldMatrix;
                    
                    // TEMP -- move to pushIsolatedStates
                	this.graphMgr.renderContext.setMatrixMode(RC_PROJECTION);
                	this.graphMgr.renderContext.pushMatrix();
                	this.graphMgr.renderContext.setMatrixMode(RC_MODELVIEW);
                	this.graphMgr.renderContext.pushMatrix();
                }
                
                // push textures
                if (isolateTextures)
                {
                    this.graphMgr.textureArrayStack.push(new TextureArray(this.graphMgr.textureArrayStack.top()));

                    // TODO: projection stack 
                }
            }
            break;

        case "rayPick":
            {
                // push dissolve and dissolve node
                if (isolateDissolves)
                {
                    lastDissolve = params.dissolve;
                    dissolveNode = this.graphMgr.getCurrentDissolve();
                }

                // push transforms
                if (isolateTransforms)
                {
                    // TODO
                }

                // push clip planes
                if (isolateClipPlanes)
                {
                    // TODO
                }
            }
            break;

        case "bbox":
            {
                // push transforms
                if (isolateTransforms)
                {
                    lastWorldMatrix = params.worldMatrix;
                }
            }
            break;
    }

    // call base-class implementation
    Group.prototype.apply.call(this, directive, params, visitChildren);

    switch (directive)
    {
        case "render":
            {
                this.popIsolatedStates();

                // TODO

                // pop transforms
                if (isolateTransforms)
                {
                    params.projMatrix = lastProjMatrix;
                    params.viewMatrix = lastViewMatrix;
                    params.worldMatrix = lastWorldMatrix;
                    
                    // TEMP -- move to popIsolatedStates
                    this.graphMgr.renderContext.setMatrixMode(RC_PROJECTION);
                	this.graphMgr.renderContext.popMatrix();
                	this.graphMgr.renderContext.setMatrixMode(RC_MODELVIEW);
                	this.graphMgr.renderContext.popMatrix();
                }
                    
                // pop textures
                if (isolateTextures)
                {
                    this.graphMgr.textureArrayStack.pop();

                    // TODO: projection stack 
                }
            }
            break;

        case "rayPick":
            {
                // pop dissolve
                if (isolateDissolves)
                {
                    params.dissolve = lastDissolve;
                    this.graphMgr.setCurrentDissolve(dissolveNode);
                }

                // pop transforms
                if (isolateTransforms)
                {
                    // TODO
                }

                // pop clip planes
                if (isolateClipPlanes)
                {
                    // TODO
                }
            }
            break;

        case "bbox":
            {
                // pop transforms
                if (isolateTransforms)
                {
                    params.worldMatrix = lastWorldMatrix;
                }
            }
            break;
    }
}

Isolator.prototype.pushIsolatedStates = function()
{
    // TODO
    
    
}

Isolator.prototype.popIsolatedStates = function()
{
    // TODO
}

function Isolator_IsolateTransformsModifiedCB(attribute, container)
{
    container.updateIsolateTransforms = true;
    container.incrementModificationCount();
}

function Isolator_IsolateLightsModifiedCB(attribute, container)
{
    container.updateIsolateLights = true;
    container.incrementModificationCount();
}

function Isolator_IsolateMaterialsModifiedCB(attribute, container)
{
    container.updateIsolateMaterials = true;
    container.incrementModificationCount();
}
 
function Isolator_IsolateTexturesModifiedCB(attribute, container)
{
    container.updateIsolateTextures = true;
    container.incrementModificationCount();
}

function Isolator_IsolateFogModifiedCB(attribute, container)
{
    container.updateIsolateFog = true;
    container.incrementModificationCount();
}

function Isolator_IsolateClipPlanesModifiedCB(attribute, container)
{
    container.updateIsolateClipPlanes = true;
    container.incrementModificationCount();
}

Dissolve.prototype = new SGNode();
Dissolve.prototype.constructor = Dissolve;

function Dissolve()
{
    SGNode.call(this);
    this.className = "Dissolve";
    this.attrType = eAttrType.Dissolve;
    
    this.lastDissolve = 0;

    this.dissolve = new NumberAttr(0);

    this.dissolve.addModifiedCB(Dissolve_DissolveModifiedCB, this);

    this.registerAttribute(this.dissolve, "dissolve");
}

Dissolve.prototype.update = function(params, visitChildren)
{
    // call base-class implementation
    SGNode.prototype.update.call(this, params, visitChildren);
}

Dissolve.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        Group.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }

    switch (directive)
    {
        case "render":
            {
                var dissolve = this.dissolve.getValueDirect();
                this.lastDissolve = dissolve;
                
                params.dissolve = dissolve;
            }
            break;

        case "rayPick":
            {
                params.dissolve = this.lastDissolve;
            }
            break;
    }

    // call base-class implementation
    SGNode.prototype.apply.call(this, directive, params, visitChildren);
}

function Dissolve_DissolveModifiedCB(attribute, container)
{
    container.incrementModificationCount();   
}
RenderParams.prototype = new DirectiveParams();
RenderParams.prototype.constructor = RenderParams();

function RenderParams()
{
    DirectiveParams.call(this);
    
    this.viewport = new Viewport();
    this.projMatrix = new Matrix4x4();
    this.viewMatrix = new Matrix4x4();
    this.worldMatrix = new Matrix4x4();
    this.dissolve = 0;
    this.opacity = 1;
    this.distanceSortAgent = null;
    this.drawTextures = true;
    this.displayListObj = null;
    this.disableDisplayLists = false;
    this.resetDisplayLists = false;
}

RenderDirective.prototype = new SGDirective();
RenderDirective.prototype.constructor = RenderDirective;

function RenderDirective()
{
    SGDirective.call(this);
    this.className = "RenderDirective";
    this.attrType = eAttrType.RenderDirective;
    
    this.name.setValueDirect("RenderDirective");

    this.distanceSortAgent = new DistanceSortAgent();
    
    this.viewport = new ViewportAttr();
    this.backgroundImageFilename = new StringAttr("");
    this.foregroundImageFilename = new StringAttr("");
    this.foregroundAlphaFilename = new StringAttr("");
    this.foregroundFadeEnabled = new BooleanAttr(false);
    this.texturesEnabled = new BooleanAttr(true);
    
    this.viewport.addModifiedCB(RenderDirective_ViewportModifiedCB, this);
    this.backgroundImageFilename.addModifiedCB(RenderDirective_BackgroundImageFilenameModifiedCB, this);
    
    this.registerAttribute(this.viewport, "viewport"); 
    this.registerAttribute(this.backgroundImageFilename, "backgroundImageFilename");
    this.registerAttribute(this.foregroundImageFilename, "foregroundImageFilename");
    this.registerAttribute(this.foregroundAlphaFilename, "foregroundAlphaFilename");   
    this.registerAttribute(this.foregroundFadeEnabled, "foregroundFadeEnabled");   
    this.registerAttribute(this.texturesEnabled, "texturesEnabled");   
       
    this.updateDirective = new UpdateDirective();
    this.resetDisplayLists = false;
}

RenderDirective.prototype.setGraphMgr = function(graphMgr)
{
    this.distanceSortAgent.setGraphMgr(graphMgr);
    
    // call base-class implementation
    SGDirective.prototype.setGraphMgr.call(this, graphMgr);
}

RenderDirective.prototype.execute = function(root)
{
    root = root || this.rootNode.getValueDirect();

    // update; combined CUpdateParams & GtUpdateParams in this version
    var params = new UpdateParams();
    params.directive = this.updateDirective;
    params.disableDisplayLists = this.resetDisplayLists;
     
    var visited = this.updateDirective.execute(root, params);

    // render
    var params = new RenderParams();
    /*
    renderParams.path = NULL;//m_path;
    renderParams.pathIndex = 1;
    renderParams.viewport = m_currentViewport;
    renderParams.jitterAmt = m_currentJitterAmt + jitterAmt; // RenderDirective jitter + AA jitter
    renderParams.distanceSortAgent = m_distanceSortAgent;
    renderParams.polygonSortAgent = m_polygonSortAgent;
    renderParams.renderSequenceAgent = m_renderSequenceAgent;
    renderParams.shadowRenderAgent = m_shadowRenderAgent;
    renderParams.drawTextures = m_texturesEnabled->GetValueDirect();
    renderParams.userData = m_userData->GetValueDirect();
     */
    params.directive = this;
    params.path = null;
    params.pathIndex = 1;
    params.viewport.loadViewport(this.viewport.getValueDirect());
    params.distanceSortAgent = this.distanceSortAgent;
    params.drawTextures = this.texturesEnabled.getValueDirect();

	// if resetting display lists, set the disableDisplayLists renderParams flag this render
    if (this.resetDisplayLists)
    {
    	params.resetDisplayLists = true;
        this.resetDisplayLists = false;
    }
        
    visited[0].apply("render", params, true);

    // sort and draw semi-transparent geometries (if any)
    if (!this.distanceSortAgent.isEmpty())
    {
        this.distanceSortAgent.sort();
        this.distanceSortAgent.draw();
        this.distanceSortAgent.clear();
    }
}

function RenderDirective_ViewportModifiedCB(attribute, container)
{
//    var vp = container.viewport.getValueDirect();
//    var url = container.backgroundImageFilename.getValueDirect().join("");
//    container.graphMgr.renderContext.setBackgroundImage(url, vp.width, vp.height);
}

function RenderDirective_BackgroundImageFilenameModifiedCB(attribute, container)
{
    var vp = container.viewport.getValueDirect();
    var pathInfo = formatPath(container.backgroundImageFilename.getValueDirect().join(""));
    
    container.backgroundImageFilename.removeModifiedCB(RenderDirective_BackgroundImageFilenameModifiedCB, container);
    container.backgroundImageFilename.setValueDirect(pathInfo[0]);
    container.backgroundImageFilename.addModifiedCB(RenderDirective_BackgroundImageFilenameModifiedCB, container);
    
    container.graphMgr.renderContext.setBackgroundImage(pathInfo[0], vp.width, vp.height);
}
RayPickParams.prototype = new DirectiveParams();
RayPickParams.prototype.constructor = RayPickParams();

function RayPickParams()
{
    DirectiveParams.call(this);
    
    /// camera to perform selection testing with
    this.camera = null;
    /// current camera
    this.currentCamera = null;
    /// current viewport
    this.viewport = new Viewport();
    /// click point
    this.clickPoint = new Vector2D();
    /// origin of the ray
    this.rayOrigin = new Vector3D();
    /// direction of the ray
    this.rayDir = new Vector3D();
    /// camera near distance
    this.nearDistance = 0;
    /// camera far distance
    this.farDistance = 0;
    /// current view matrix
    this.viewMatrix = new Matrix4x4();
    /// current world matrix
    this.worldMatrix = new Matrix4x4();
    /// current sector origin
    this.sectorOrigin = new Vector3D();
    /// current material double-sided setting 
    this.doubleSided = false;
    /// current material opacity setting
    this.opacity = 0;
    /// current dissolve
    this.dissolve = 0;
    /// current clip plane(s)
    this.clipPlanes = [];
}

function RayPickRecord(path, intersectRecord, camera)
{
    /// the path of the picked geometry
    this.path = path.copy();
    /// intersection record
    this.intersectRecord = intersectRecord;
    /// the camera viewing the picked geometry
    this.camera = camera;
}

RayPickDirective.prototype = new SGDirective();
RayPickDirective.prototype.constructor = RayPickDirective;

function RayPickDirective()
{
    SGDirective.call(this);
    this.className = "RayPickDirective";
    this.attrType = eAttrType.RayPickDirective;
    
    this.name.setValueDirect("RayPickDirective");
    
    this.picked = [];
    
    this.viewport = new ViewportAttr();
    this.camera = new ReferenceAttr(null);
    this.clickPoint = new Vector2DAttr();
    
    this.registerAttribute(this.viewport, "viewport");
    this.registerAttribute(this.camera, "camera");
    this.registerAttribute(this.clickPoint, "clickPoint");
}

RayPickDirective.prototype.execute = function(root)
{
    root = root || this.rootNode.getValueDirect();
    
    // clear previous picks
    this.picked.length = 0;
    
    // pick
    var params = new RayPickParams();
    params.directive = this;
    params.camera = this.camera.getValueDirect();
    params.viewport.loadViewport(this.viewport.getValueDirect());
    params.clickPoint.copy(this.clickPoint.getValueDirect());

    root.apply("rayPick", params, true);
}

RayPickDirective.prototype.addPickRecord = function(record)
{
    // add to picked list according to distance
    for (var i=0; i < this.picked.length; i++)
    {
        if (this.picked[i].intersectRecord.distance > record.intersectRecord.distance)
        {
            break;
        }
    }
    this.picked.splice(i, 0, record);
}






BBoxParams.prototype = new DirectiveParams();
BBoxParams.prototype.constructor = BBoxParams();

function BBoxParams()
{
    DirectiveParams.call(this);

    this.viewSpace = false;
    this.viewMatrix = new Matrix4x4();
    this.worldMatrix = new Matrix4x4();
    this.minPoint = new Vector3D();
    this.maxPoint = new Vector3D();
    this.minMaxSet = false;
}

BBoxDirective.prototype = new SGDirective();
BBoxDirective.prototype.constructor = BBoxDirective;

function BBoxDirective()
{
    SGDirective.call(this);
    this.className = "BBoxDirective";
    this.attrType = eAttrType.BBoxDirective;

    this.min = new Vector3D();
    this.max = new Vector3D();
    
    this.name.setValueDirect("BBoxDirective");

    this.viewSpace = new BooleanAttr(false);
    this.viewTransform = new Matrix4x4Attr(1, 0, 0, 0,
                                           0, 1, 0, 0,
                                           0, 0, 1, 0,
                                           0, 0, 0, 1);

    this.registerAttribute(this.viewSpace, "viewSpace");
    this.registerAttribute(this.viewTransform, "viewTransform");
}

BBoxDirective.prototype.execute = function(root)
{
    root = root || this.rootNode.getValueDirect();

    // setup bbox params structure
    var params = new BBoxParams();
    params.viewSpace = this.viewSpace.getValueDirect();
    var viewMatrix = this.viewTransform.getValueDirect();
    params.viewMatrix.load(viewMatrix._11, viewMatrix._12, viewMatrix._13, viewMatrix._14,
                           viewMatrix._21, viewMatrix._22, viewMatrix._23, viewMatrix._24,
                           viewMatrix._31, viewMatrix._32, viewMatrix._33, viewMatrix._34,
                           viewMatrix._41, viewMatrix._42, viewMatrix._43, viewMatrix._44);

    // calculate bounding box
    root.apply("bbox", params, true);

    this.min = params.minPoint;
    this.max = params.maxPoint;
}

BBoxDirective.prototype.getBounds = function()
{
    return { min: this.min, max: this.max };
}

Geometry.prototype = new RenderableElement();
Geometry.prototype.constructor = Geometry;

function Geometry()
{
    RenderableElement.call(this);
    this.className = "Geometry";
    this.attrType = eAttrType.Geometry;

    this.boundingTree = new Octree();

    this.updateBoundingTree = false;
    this.updateIntersectionModel = false;
    this.updateStationary = false;

    this.selectable = new BooleanAttr(true);
    this.cullable = new BooleanAttr(true);
    this.show = new BooleanAttr(true);
    this.approximationLevels = new NumberAttr(1);
    this.showApproximationLevel = new NumberAttr(-1);
    this.sortPolygons = new BooleanAttr(false);
    this.flipPolygons = new BooleanAttr(false);
    this.intersector = new BooleanAttr(true);
    this.intersectee = new BooleanAttr(true);
    this.stationary = new BooleanAttr(false);
    this.shadowCaster = new BooleanAttr(false);
    this.shadowTarget = new BooleanAttr(true);

    this.selectable.addModifiedCB(Geometry_SelectableModifiedCB, this);
    this.show.addModifiedCB(Geometry_ShowModifiedCB, this);
    this.approximationLevels.addModifiedCB(Geometry_ApproximationLevelsModifiedCB, this);
    this.showApproximationLevel.addModifiedCB(Geometry_ShowApproximationLevelModifiedCB, this);
    this.intersector.addModifiedCB(Geometry_IntersectorModifiedCB, this);
    this.intersectee.addModifiedCB(Geometry_IntersecteeModifiedCB, this);
    this.stationary.addModifiedCB(Geometry_StationaryModifiedCB, this);

    this.registerAttribute(this.selectable, "selectable");
    this.registerAttribute(this.cullable, "cullable");
    this.registerAttribute(this.show, "show");
    this.registerAttribute(this.approximationLevels, "approximationLevels");
    this.registerAttribute(this.showApproximationLevel, "showApproximationLevel");
    this.registerAttribute(this.sortPolygons, "sortPolygons");
    this.registerAttribute(this.flipPolygons, "flipPolygons");
    this.registerAttribute(this.intersector, "intersector");
    this.registerAttribute(this.intersectee, "intersectee");
    this.registerAttribute(this.stationary, "stationary");
    this.registerAttribute(this.shadowCaster, "shadowCaster");
    this.registerAttribute(this.shadowTarget, "shadowTarget");
}

Geometry.prototype.update = function(params, visitChildren)
{
    if (this.updateBoundingTree)
    {
        this.updateBoundingTree = false;

        this.buildBoundingTree();
    }

    // call base-class implementation
    RenderableElement.prototype.update.call(this, params, visitChildren);
}

Geometry.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        RenderableElement.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }

    switch (directive)
    {
        case "render":
            {
                var drawNow = true;
                var dissolve = params.dissolve;
                var opacity = params.opacity;
                if (dissolve == 1)// || opacity == 0) // completely transparent objects can still reflect specularity
                {
                    // completely transparent, skip drawing
                    drawNow = false;
                }
                else if (dissolve > 0 ||
                         opacity < 1 ||
                         this.graphMgr.textureArrayStack.top().textures[eTextureType.Transparency].length > 0 ||
                         this.graphMgr.projectionTextureArrayStack.top().textures[eTextureType.Transparency].length > 0)
                {
                    // get bbox of geometry
                    var bounds = this.getBBox();

                    // add geometry to distance sort agent for sorted drawing
                    params.distanceSortAgent.addGeometry(this, bounds.min, bounds.max, dissolve);
                    drawNow = false;
                }

                if (drawNow)
                {
                    this.draw(dissolve);
                }
            }
            break;

        case "rayPick":
            {
                if (this.selectable.getValueDirect() == true &&
                    params.opacity > 0 &&
                    params.dissolve < 1)
                {
                    var worldViewMatrix = params.worldMatrix.multiply(params.viewMatrix);
                    var scale = worldViewMatrix.getScalingFactors();

                    var intersectRecord = rayPick(this.boundingTree, params.rayOrigin, params.rayDir,
                                                  params.nearDistance, params.farDistance,
                                                  params.worldMatrix, params.viewMatrix,
                                                  max3(scale.x, scale.y, scale.z),
                                                  params.doubleSided, params.clipPlanes);
                    if (intersectRecord)
                    {
                        params.currentNodePath.push(this);
                        params.directive.addPickRecord(new RayPickRecord(params.currentNodePath, intersectRecord, params.camera));
                        params.currentNodePath.pop();
                    }
                }
            }
            break;

        case "bbox":
            {
                var bounds = this.getBBox();

                var matrix = new Matrix4x4();
                matrix.loadMatrix(params.worldMatrix);

                if (params.viewSpace)
                {
                    // user wants bbox in view space; multiply world matrix by view matrix
                    // to get worldView matrix
                    matrix.loadMatrix(matrix.multiply(params.viewMatrix));
                }

                var min = matrix.transform(bounds.min.x, bounds.min.y, bounds.min.z, 1);
                var max = matrix.transform(bounds.max.x, bounds.max.y, bounds.max.z, 1);

                if (params.minMaxSet)
                {
                    params.minPoint.x = Math.min(params.minPoint.x, Math.min(min.x, max.x));
                    params.minPoint.y = Math.min(params.minPoint.y, Math.min(min.y, max.y));
                    params.minPoint.z = Math.min(params.minPoint.z, Math.min(min.z, max.z));

                    params.maxPoint.x = Math.max(params.maxPoint.x, Math.max(min.x, max.x));
                    params.maxPoint.y = Math.max(params.maxPoint.y, Math.max(min.y, max.y));
                    params.maxPoint.z = Math.max(params.maxPoint.z, Math.max(min.z, max.z));
                }
                else // !params.minMaxSet
                {
                    params.minPoint.x = Math.min(min.x, max.x);
                    params.minPoint.y = Math.min(min.y, max.y);
                    params.minPoint.z = Math.min(min.z, max.z);

                    params.maxPoint.x = Math.max(min.x, max.x);
                    params.maxPoint.y = Math.max(min.y, max.y);
                    params.maxPoint.z = Math.max(min.z, max.z);

                    params.minMaxSet = true;
                }
            }
            break;
    }

    // call base-class implementation
    RenderableElement.prototype.apply.call(this, directive, params, visitChildren);
}

Geometry.prototype.draw = function(dissolve)
{
}

Geometry.prototype.getBBox = function()
{
    return { min: this.bbox.min.getValueDirect(), max: this.bbox.max.getValueDirect() };
}

function Geometry_SelectableModifiedCB(attribute, container)
{
}

function Geometry_ShowModifiedCB(attribute, container)
{
    container.incrementModificationCount();
}

function Geometry_ApproximationLevelsModifiedCB(attribute, container)
{
    container.updateBoundingTree = true;
    container.incrementModificationCount();
}

function Geometry_ShowApproximationLevelModifiedCB(attribute, container)
{
    container.incrementModificationCount();
}

function Geometry_IntersectorModifiedCB(attribute, container)
{
    container.updateIntersectionModel = true;
}

function Geometry_IntersecteeModifiedCB(attribute, container)
{
    container.updateIntersectionModel = true;
}

function Geometry_StationaryModifiedCB(attribute, container)
{
    container.updateStationary = true;
}
VertexGeometry.prototype = new Geometry();
VertexGeometry.prototype.constructor = VertexGeometry;

function VertexGeometry()
{
    Geometry.call(this);
    this.className = "VertexGeometry";
    this.attrType = eAttrType.VertexGeometry;

    this.updateVertices = false;
    this.updateUVCoords = [];
    this.uvCoords = [];
    this.vertexBuffer = null;
    
    this.vertices = new NumberArrayAttr();
    
    this.vertices.addModifiedCB(VertexGeometry_VerticesModifiedCB, this);
    
    this.registerAttribute(this.vertices, "vertices");
}
VertexGeometry.prototype.postCloneChild = function(childClone,pathSrc,pathClone)
{
    var i;
    var node;

    // setup uv-coords for cloned vertex geometry

    // find texture nodes affecting this node
    var textureNodes;
    for (i=0; i < pathSrc.length(); i++)
    {
        node = pathSrc.stack[i];
        if (node.getAttribute() == eAttrType.Texture)
        {
            if (!(textureNodes.push(node))) return;
        }
    }

    // find texture nodes affecting the clone
    var textureNodesClone;
    for (i=0; i < pathClone.length(); i++)
    {
        node = pathClone.stack[i];
        if (node.getAttribute() == eAttrType.Texture)
        {
            if (!(textureNodesClone.push(node))) return;
        }
    }

    // for each texture node, setup the uv-coords (textureNodes.size() and
    // textureNodesClone.size() should be the same, but check anyway)
   // CFloatArrayAttr* uvCoords = null;
    var uvCoords = new NumberArrayAttr();

    for (i=0; i < textureNodes.size() && i < textureNodesClone.size(); i++)
    {
        //uvCoords = FindUVCoords(dynamic_cast<GcTexture*>(textureNodes[i]));
        uvCoords = this.findUVCoords(textureNodes[i]);

        if (uvCoords)
        {
            var uvCoords2 = new NumberArrayAttr();
            uvCoords2 = childClone.getUVCoords(textureNodesClone[i]);
            uvCoords2.copyValue(uvCoords);
        }
    }

    // call base-class implementation
    //GcSGNode::Post_Clone_Child(childClone, pathSrc, pathClone); Not being used right now. Maybe used in the futrue.
}


VertexGeometry.prototype.getUVCoords = function(texture)
{
    for (var i=0; i < this.uvCoords.length; i++)
    {
        if (this.uvCoords[i].first == texture)
            return this.uvCoords[i].second;
    }       
    
    var uvCoords = new NumberArrayAttr();
    uvCoords.addModifiedCB(VertexGeometry_UVCoordsModifiedCB, this);
    this.uvCoords.push(new Pair(texture, uvCoords));
    
    return uvCoords;
}
VertexGeometry.prototype.findUVCoords = function(texture)
{
    if (!texture)
    {
        return null;
    }

    for (var i=0; i < this.uvCoords.length; i++)
    {
        if (this.uvCoords[i].first == texture)
            return this.uvCoords[i].second;
    }

    return null;
}

VertexGeometry.prototype.update = function(params, visitChildren)
{
    if (this.updateVertices)
    {
        this.updateVertices = false;
        
        this.vertexBuffer.setVertices(this.vertices.getValueDirect());
        
        this.updateBoundingTree = true;
        
        this.calculateBBox();
    }
    
    if (this.updateUVCoords.length)
    {
        for (var i=0; i < this.updateUVCoords.length; i++)
        {
            for (var j=0; j < this.uvCoords.length; j++)
            {
                if (this.uvCoords[j].second == this.updateUVCoords[i])
                {
                    this.vertexBuffer.setUVCoords(this.uvCoords[j].first.textureObj, this.uvCoords[j].second.getValueDirect());
                    break;
                }
            }   
        }
        this.updateUVCoords.length = 0;
    }
    
    // call base-class implementation
    Geometry.prototype.update.call(this, params, visitChildren);
}

VertexGeometry.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        Geometry.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }
    
    switch (directive)
    {
        case "render":
            {
            }
            break;
    }
    
    // call base-class implementation
    Geometry.prototype.apply.call(this, directive, params, visitChildren);
}

VertexGeometry.prototype.drawTextured = function(dissolve)
{
    var texture0 = null;
    var texture1 = null;

    // enable blending
    this.graphMgr.renderContext.enable(eRenderMode.AlphaBlend);

    // set blend factors
    this.graphMgr.renderContext.setBlendFactor(RC_SRC_ALPHA, RC_ONE_MINUS_SRC_ALPHA);

    // get number of texture stages
    var maxStages = this.graphMgr.renderContext.getMaxTextureStages();

    // get texture array
    var textureArray = this.graphMgr.textureArrayStack.top();

    // get current material node component levels
    var ambientLevel = 1;
    var diffuseLevel = 1;
    var specularLevel = 1;
    var emissiveLevel = 1;
    var material = this.graphMgr.getCurrentMaterial();
    if (material)
    {
        ambientLevel = material.getAttribute("ambientLevel").getValueDirect();
        diffuseLevel = material.getAttribute("diffuseLevel").getValueDirect();
        specularLevel = material.getAttribute("specularLevel").getValueDirect();
        emissiveLevel = material.getAttribute("emissiveLevel").getValueDirect();
    }

    // get current material
    var currMatDesc = this.graphMgr.renderContext.getFrontMaterial();

    // push current material
    this.graphMgr.renderState.push(RENDERSTATE_MATERIAL_BIT);

    // if non-zero dissolve, set to material
    if (dissolve > 0)
    {
        currMatDesc.ambient.a *= (1 - dissolve);
        currMatDesc.diffuse.a *= (1 - dissolve);
        currMatDesc.specular.a *= (1 - dissolve);
        currMatDesc.emissive.a *= (1 - dissolve);
        this.graphMgr.renderContext.setFrontMaterial(currMatDesc);
    }

    // if transparency texture, set to stage 0
    if (textureArray.textures[eTextureType.Transparency].length)
    {
        var texture = textureArray.textures[eTextureType.Transparency][0];
        var uvCoords = this.getUVCoords(texture);

        if (uvCoords && uvCoords.getLength() > 0)
        {
            // lock texture (keep it from being modified)
            //texture->Lock();

            this.setTextureStage(0, eTextureType.Transparency, texture, texture.transformCompound);
            texture0 = texture;
        }

        // disable stage 1
        if (maxStages > 1)
        {
            this.graphMgr.renderContext.enableTextureStage(1, 0);
            texture1 = null;
        }
    }

    // if color texture, set material for blending
    if (textureArray.textures[eTextureType.Color].length)
    {
        this.setBlendingMaterial(textureArray.textures[eTextureType.Color][0].getAttribute("opacity").getValueDirect(),
        ambientLevel, diffuseLevel, specularLevel, emissiveLevel);
    }

    // set texture blend factor
    this.graphMgr.renderContext.setTextureBlendFactor(currMatDesc.diffuse.a * (1 - dissolve));

    // draw untextured if no color texture is present, or if color texture's opacity < 1
    if (textureArray.textures[eTextureType.Color].length == 0 ||
        textureArray.textures[eTextureType.Color][0].getAttribute("opacity").getValueDirect() < 1)
    {
        this.vertexBuffer.draw();
    }

    if (texture0)
    {
        this.graphMgr.renderContext.enableTextureStage(0, 0);
        //texture0->Unlock();
        texture0 = null;
    }
    if (texture1)
    {
        this.graphMgr.renderContext.enableTextureStage(1, 0);
        //texture1->Unlock();
        texture1 = null;
    }
    
    // draw color texture(s)
    for (var i = 0; i < textureArray.textures[eTextureType.Color].length; i++)
    {
        var texture = textureArray.textures[eTextureType.Color][i];
        var uvCoords = this.getUVCoords(texture);

        if (uvCoords && uvCoords.getLength() > 0)
        {
            // lock texture (keep it from being modified)
            //texture->Lock();

            this.setTextureStage(0, eTextureType.Color, texture, texture.transformCompound);
            texture0 = texture;

            // set material for blending
            this.setBlendingMaterial(texture.getAttribute("opacity").getValueDirect(),
            ambientLevel, diffuseLevel, specularLevel, emissiveLevel);

            // set texture blend factor
            this.graphMgr.renderContext.setTextureBlendFactor(currMatDesc.diffuse.a * (1 - dissolve) * texture.getAttribute("opacity").getValueDirect());
        }

        // if transparency texture, and maxStages > 1, set to stage 1
        if (maxStages > 1)
        {
            if (textureArray.textures[eTextureType.Transparency].length)
            {
                texture = textureArray.textures[eTextureType.Transparency][0];
                uvCoords = this.getUVCoords(texture);

                if (uvCoords && uvCoords.getLength() > 0)
                {
                    // lock texture (keep it from being modified)
                    //texture->Lock();

                    this.setTextureStage(1, eTextureType.Transparency, texture, texture.transformCompound);
                    texture1 = texture;
                }
            }
        }

        // draw primitives
        this.vertexBuffer.draw();

        if (texture0)
        {
            this.graphMgr.renderContext.enableTextureStage(0, 0);
            //texture0->Unlock();
            texture0 = null;
        }
        if (texture1)
        {
            this.graphMgr.renderContext.enableTextureStage(1, 0);
            //texture1->Unlock();
            texture1 = null;
        }
    }

    // TODO
    /*
    // if object doesn't contain any specularity textures,
    // make an additional pass to add specular highlights;
    // skip this step if fog is enabled (causes ultra-white surface artifacts)
    var numSpecularityTextures = textureArray.textures[eTextureType.Specularity].length;
    // TODO: + m_graphMgr->GetProjectionTextureStack().top().textures[GeTextureType_Color].size();

    if (numSpecularityTextures == 0 &&
        specularLevel > 0) // TODO: && !renderEngine->IsRenderModeEnabled(Re_Fog)
    {
        this.setSpecularMaterial(currMatDesc.specular, currMatDesc.glossiness);
        this.graphMgr.renderContext.setBlendFactor(RC_ONE, RC_ONE);
        
        // if transparency texture, set to stage 0
        if (textureArray.textures[eTextureType.Transparency].length)
        {
            var texture = textureArray.textures[eTextureType.Transparency][0];
            var uvCoords = this.getUVCoords(texture);

            if (uvCoords && uvCoords.getLength() > 0)
            {
                // lock texture (keep it from being modified)
                //texture->Lock();

                this.setTextureStage(0, eTextureType.Transparency, texture, texture.transformCompound);
                texture0 = texture;
            }

            // disable stage 1
            if (maxStages > 1)
            {
                this.graphMgr.renderContext.enableTextureStage(1, 0);
                texture1 = null;
            }
        }
        
        // draw primitives
        this.vertexBuffer.draw();
        
        if (texture0)
        {
            this.graphMgr.renderContext.enableTextureStage(0, 0);
            //texture0->Unlock();
            texture0 = null;
        }
    }
    */
    // disable texture stage 0
    this.graphMgr.renderContext.enableTextureStage(0, 0);
    
    // disable blending
    this.graphMgr.renderContext.disable(eRenderMode.AlphaBlend);

    // pop current material
    this.graphMgr.renderState.pop(RENDERSTATE_MATERIAL_BIT);
}

VertexGeometry.prototype.setTextureStage = function(stage, type, texture, textureTransform, 
textureCoordSrc, planeCoefficients)
{
    // get optional parameters
    textureTransform = textureTransform || new Matrix4x4();
    textureCoordSrc = textureCoordSrc || eTextureCoordSrc.VertexUVs;
    planeCoefficients = planeCoefficients ||  new Matrix4x4();   
    
    // enable texture stage
    this.graphMgr.renderContext.enableTextureStage(stage, 1);

    // get texture wrap
    var widthWrap = texture.getAttribute("widthWrap").getValueDirect();
    var heightWrap = texture.getAttribute("heightWrap").getValueDirect();
    var widthWrapType, heightWrapType;
    switch (widthWrap)
    {
        case eTextureWrap.Clamp:
            widthWrapType = RC_CLAMP_TO_EDGE;
            break;

        case eTextureWrap.Repeat:
        default:
            widthWrapType = RC_REPEAT;
            break;
    }
    switch (heightWrap)
    {
        case eTextureWrap.Clamp:
            heightWrapType = RC_CLAMP_TO_EDGE;
            break;

        case eTextureWrap.Repeat:
        default:
            heightWrapType = RC_REPEAT;
            break;
    }
    
    // set texture
    this.vertexBuffer.setTextureStage(stage, texture.textureObj, 
    widthWrapType, heightWrapType, textureCoordSrc, planeCoefficients);

    // set texture blend operation
    var op;
    switch (type)
    {
        case eTextureType.Color:
            op = RC_MODULATE;
            break;

        case eTextureType.Diffuse:
        case eTextureType.Luminosity:
        case eTextureType.Specularity:
            op = RC_REPLACE;
            break;

        case eTextureType.Transparency:
            op = RC_MODULATE;//BLEND;
            break;

        default:
            return;
    }

    this.graphMgr.renderContext.setTextureBlendOp(op);

    /* TODO
    // set texture matrix
    // TODO: only load texture transforms if they are enabled
    ReMatrixMode mode;
    switch (stage)
    {
    case 0: mode = ReMatrixMode_Texture0; break;
    case 1: mode = ReMatrixMode_Texture1; break;
    case 2: mode = ReMatrixMode_Texture2; break;
    case 3: mode = ReMatrixMode_Texture3; break;
    case 4: mode = ReMatrixMode_Texture4; break;
    case 5: mode = ReMatrixMode_Texture5; break;
    case 6: mode = ReMatrixMode_Texture6; break;
    case 7: mode = ReMatrixMode_Texture7; break;
    }
    this.graphMgr.renderContext.SetMatrixMode(mode);
    this.graphMgr.renderContext.LoadMatrix(textureTransform);
    
    this.graphMgr.renderContext.SetMatrixMode(ReMatrixMode_WorldView);
     */
}

VertexGeometry.prototype.setBlendingMaterial = function(opacity, ambientLevel, diffuseLevel, 
specularLevel, emissiveLevel)
{
    var matDesc = this.graphMgr.renderContext.getFrontMaterial();
    
    // setup material for texture blending operations
    var ambientBlend  = opacity * ambientLevel;
    var diffuseBlend  = opacity * diffuseLevel;
    var specularBlend = opacity * specularLevel;
    var emissiveBlend = opacity * emissiveLevel;

    // ambient
    matDesc.ambient.r = ambientBlend + matDesc.ambient.r * (1-opacity);
    matDesc.ambient.g = ambientBlend + matDesc.ambient.g * (1-opacity);
    matDesc.ambient.b = ambientBlend + matDesc.ambient.b * (1-opacity);
    //matDesc.ambient.a *= opacity;
    
    // diffuse
    matDesc.diffuse.r = diffuseBlend + matDesc.diffuse.r * (1-opacity);
    matDesc.diffuse.g = diffuseBlend + matDesc.diffuse.g * (1-opacity);
    matDesc.diffuse.b = diffuseBlend + matDesc.diffuse.b * (1-opacity);
    //matDesc.diffuse.a *= opacity;

    // specular (turn off)
    matDesc.specular.r = 0;//specularBlend + matDesc.specular.r * (1-opacity);
    matDesc.specular.g = 0;//specularBlend + matDesc.specular.g * (1-opacity);
    matDesc.specular.b = 0;//specularBlend + matDesc.specular.b * (1-opacity);
    //matDesc.specular.a *= opacity;
    matDesc.glossiness = 1;//matDesc.glossiness;

    // emissive
    matDesc.emissive.r = emissiveBlend + matDesc.emissive.r * (1-opacity);
    matDesc.emissive.g = emissiveBlend + matDesc.emissive.g * (1-opacity);
    matDesc.emissive.b = emissiveBlend + matDesc.emissive.b * (1-opacity);
    //matDesc.emissive.a *= opacity;
    
    matDesc.validMembersMask = MATERIALDESC_ALL_BITS;

    this.graphMgr.renderContext.setFrontMaterial(matDesc);
}

VertexGeometry.prototype.setSpecularMaterial = function(specular, glossiness)
{
    var matDesc = new MaterialDesc();
    matDesc.validMembersMask = MATERIALDESC_ALL_BITS;
    matDesc.specular = specular;
    matDesc.glossiness = glossiness;

    this.graphMgr.renderContext.setFrontMaterial(matDesc);
    this.graphMgr.renderContext.setBlendFactor(RC_ONE_MINUS_SRC_ALPHA, RC_ONE);
}

VertexGeometry.prototype.calculateBBox = function()
{
    var vertices = this.vertices.getValueDirect();
    if (vertices.length < 3) return;
    
    var min = new Vector3D(vertices[0], vertices[1], vertices[2]);
    var max = new Vector3D(vertices[0], vertices[1], vertices[2]);
    
    for (var i=3; i < vertices.length; i+=3)
    {
        min.x = Math.min(min.x, vertices[i  ]);
        min.y = Math.min(min.y, vertices[i+1]);
        min.z = Math.min(min.z, vertices[i+2]);

        max.x = Math.max(max.x, vertices[i  ]);
        max.y = Math.max(max.y, vertices[i+1]);
        max.z = Math.max(max.z, vertices[i+2]);
    }

    this.bbox.getAttribute("min").setValueDirect(min.x, min.y, min.z);
    this.bbox.getAttribute("max").setValueDirect(max.x, max.y, max.z);
}

function VertexGeometry_VerticesModifiedCB(attribute, container)
{
    container.updateVertices = true;
    container.incrementModificationCount();
}

function VertexGeometry_UVCoordsModifiedCB(attribute, container)
{
    container.updateUVCoords.push(attribute);
    container.incrementModificationCount();
}
TriList.prototype = new VertexGeometry();
TriList.prototype.constructor = TriList;

function TriList()
{
    VertexGeometry.call(this);
    this.className = "TriList";
    this.attrType = eAttrType.TriList;
    
    this.updateNormals = false;
    
    this.normals = new NumberArrayAttr();
    
    this.vertices.addModifiedCB(TriList_NormalsModifiedCB, this);
    
    this.registerAttribute(this.normals, "normals");
}

TriList.prototype.update = function(params, visitChildren)
{
    if (!this.vertexBuffer)
    {
        this.vertexBuffer = this.graphMgr.renderContext.createVertexBuffer(3);
        this.vertexBuffer.setPrimitiveType(RC_TRIANGLES);
    }
       
    if (this.updateNormals)
    {
        this.updateNormals = false;
        
        this.vertexBuffer.setNormals(this.normals.getValueDirect());
    }
    
    // call base-class implementation
    VertexGeometry.prototype.update.call(this, params, visitChildren);
}

TriList.prototype.apply = function(directive, params, visitChildren)
{
    // call base-class impementation
    VertexGeometry.prototype.apply.call(this, directive, params, visitChildren);
}

TriList.prototype.draw = function(dissolve)
{
    // TODO
    
    // draw with textures
    this.drawTextured(dissolve);
}

TriList.prototype.buildBoundingTree = function()
{
    var vertices = this.vertices.getValueDirect();
    
    var tris = [];
    for (var i=0, vertex=0; vertex+8 < vertices.length; i++, vertex+=9)
    {
        tris.push(new Triangle(vertices[vertex  ],  // v0
                               vertices[vertex+1],
                               vertices[vertex+2],
                               
                               vertices[vertex+3],  // v1
                               vertices[vertex+4],
                               vertices[vertex+5],
                               
                               vertices[vertex+6],  // v2
                               vertices[vertex+7],
                               vertices[vertex+8]));
    }
    
    var min = this.bbox.getAttribute("min").getValueDirect();
    var max = this.bbox.getAttribute("max").getValueDirect();
    
    this.boundingTree.setTriangles(tris, min, max);
    this.boundingTree.buildTree(this.approximationLevels.getValueDirect());
}

function TriList_NormalsModifiedCB(attribute, container)
{
    container.updateNormals = true;
    container.incrementModificationCount();
}
Material.prototype = new SGNode();
Material.prototype.constructor = Material;

function Material()
{
    SGNode.call(this);
    this.className = "Material";
    this.attrType = eAttrType.Material;
    
    this.updateColor = false;
    this.updateAmbientLevel = false;
    this.updateDiffuseLevel = false;
    this.updateSpecularLevel = false;
    this.updateEmissiveLevel = false;
    this.updateAmbient = true;
    this.updateDiffuse = true;
    this.updateSpecular = true;
    this.updateEmissive = true;
    this.updateGlossiness = true;
    this.updateOpacity = true;
    this.lastOpacity = 0;
    this.lastDoubleSided = false;
    this.materialDesc = new MaterialDesc();
    this.materialDesc.validMembersMask = MATERIALDESC_ALL_BITS;
    
    this.color = new ColorAttr(1, 1, 1, 1);
    this.ambientLevel = new NumberAttr(1);
    this.diffuseLevel = new NumberAttr(1);
    this.specularLevel = new NumberAttr(1);
    this.emissiveLevel = new NumberAttr(0);
    this.ambient = new ColorAttr(0.2, 0.2, 0.2, 1);
    this.diffuse = new ColorAttr(0.8, 0.8, 0.8, 1);
    this.specular = new ColorAttr(0, 0, 0, 1);
    this.emissive = new ColorAttr(0, 0, 0, 1);
    this.glossiness = new NumberAttr(0);
    this.opacity = new NumberAttr(1);
    this.doubleSided = new BooleanAttr(false);
	
    this.color.addModifiedCB(Material_ColorModifiedCB, this);
    this.ambientLevel.addModifiedCB(Material_AmbientLevelModifiedCB, this);
    this.diffuseLevel.addModifiedCB(Material_DiffuseLevelModifiedCB, this);
    this.specularLevel.addModifiedCB(Material_SpecularLevelModifiedCB, this);
    this.emissiveLevel.addModifiedCB(Material_EmissiveLevelModifiedCB, this);
    this.ambient.addModifiedCB(Material_AmbientModifiedCB, this);
    this.diffuse.addModifiedCB(Material_DiffuseModifiedCB, this);
    this.specular.addModifiedCB(Material_SpecularModifiedCB, this);
    this.emissive.addModifiedCB(Material_EmissiveModifiedCB, this);
    this.glossiness.addModifiedCB(Material_GlossinessModifiedCB, this);
    this.opacity.addModifiedCB(Material_OpacityModifiedCB, this);
    this.doubleSided.addModifiedCB(Material_DoubleSidedModifiedCB, this);

    this.registerAttribute(this.color, "color");
    this.registerAttribute(this.ambientLevel, "ambientLevel");
    this.registerAttribute(this.diffuseLevel, "diffuseLevel");
    this.registerAttribute(this.specularLevel, "specularLevel");
    this.registerAttribute(this.emissiveLevel, "emissiveLevel");
    this.registerAttribute(this.ambient, "ambient");
    this.registerAttribute(this.diffuse, "diffuse");
    this.registerAttribute(this.specular, "specular");
    this.registerAttribute(this.emissive, "emissive");
    this.registerAttribute(this.glossiness, "glossiness");
    this.registerAttribute(this.opacity, "opacity");
    this.registerAttribute(this.doubleSided, "doubleSided");
}

Material.prototype.update = function(params, visitChildren)
{
    if (this.updateColor)
    {
        this.updateColor = false;

        this.updateAmbientLevel = true;
        this.updateDiffuseLevel = true;
        this.updateSpecularLevel = true;
        this.updateEmissiveLevel = true;
    }

    if (this.updateAmbientLevel || this.updateDiffuseLevel || this.updateSpecularLevel || this.updateEmissiveLevel)
    {
        var color = this.color.getValueDirect();

        if (this.updateAmbientLevel)
        {
            this.updateAmbientLevel = false;
            
            var level = this.ambientLevel.getValueDirect();
            this.ambient.setValueDirect(color.r * level, color.g * level, color.b * level, color.a);
        }

        if (this.updateDiffuseLevel)
        {
            this.updateDiffuseLevel = false;
            
            var level = this.diffuseLevel.getValueDirect();
            this.diffuse.setValueDirect(color.r * level, color.g * level, color.b * level, color.a);
        }

        if (this.updateSpecularLevel)
        {
            this.updateSpecularLevel = false;
            
            var level = this.specularLevel.getValueDirect();
            this.specular.setValueDirect(color.r * level, color.g * level, color.b * level, color.a);
        }

        if (this.updateEmissiveLevel)
        {
            this.updateEmissiveLevel = false;
            
            var level = this.emissiveLevel.getValueDirect();
            this.emissive.setValueDirect(color.r * level, color.g * level, color.b * level, color.a);
        }
    }

    var opacity = this.opacity.getValueDirect();

    var forceUpdate = false;

    if (this.updateOpacity)
    {
        this.updateOpacity = false;
        
        this.lastOpacity = opacity;

        // have to re-update all members
        forceUpdate = true;
    }

    if (this.updateAmbient || forceUpdate)
    {
        this.updateAmbient = false;
        
        this.materialDesc.ambient.copy(this.ambient.getValueDirect());
        this.materialDesc.ambient.a *= opacity;
    }

    if (this.updateDiffuse || forceUpdate)
    {
        this.updateDiffuse = false;
        
        this.materialDesc.diffuse.copy(this.diffuse.getValueDirect());
        this.materialDesc.diffuse.a *= opacity;
    }

    if (this.updateSpecular || forceUpdate)
    {
        this.updateSpecular = false;
        
        this.materialDesc.specular.copy(this.specular.getValueDirect());
        this.materialDesc.specular.a *= opacity;
    }

    if (this.updateEmissive || forceUpdate)
    {
        this.updateEmissive = false;
        
        this.materialDesc.emissive.copy(this.emissive.getValueDirect());
        this.materialDesc.emissive.a *= opacity;
    }

    if (this.updateGlossiness || forceUpdate)
    {
        this.updateGlossiness = false;
        
        this.materialDesc.glossiness = this.glossiness.getValueDirect();
    }
    
    // call base-class implementation
    SGNode.prototype.update.call(this, params, visitChildren);
}

Material.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        SGNode.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }
    
    this.graphMgr.setCurrentMaterial(this);
    
    switch (directive)
    {
        case "render":
        {
            params.opacity = this.lastOpacity; // set in update()
            
            this.applyMaterialDesc();
        }
        break;
        
        case "rayPick":
        {
            params.doubleSided = this.lastDoubleSided;
            params.opacity = this.lastOpacity;
        }
        break;
    }
    
    // call base-class implementation
    SGNode.prototype.apply.call(this, directive, params, visitChildren);
}

Material.prototype.applyMaterialDesc = function()
{
    // set material
    this.graphMgr.renderContext.setFrontMaterial(this.materialDesc);
    
    // enable/disable backface culling
    var doubleSided = this.doubleSided.getValueDirect();
    this.lastDoubleSided = doubleSided;
    if (doubleSided)
    {
        this.graphMgr.renderContext.disable(eRenderMode.CullBackFace);
    }
    else // !doubleSided
    {
        this.graphMgr.renderContext.enable(eRenderMode.CullBackFace);
    }
}

function Material_ColorModifiedCB(attribute, container)
{
    container.updateColor = true;
    container.incrementModificationCount();
}

function Material_AmbientLevelModifiedCB(attribute, container)
{
    container.updateAmbientLevel = true;
    container.incrementModificationCount();
}

function Material_DiffuseLevelModifiedCB(attribute, container)
{
    container.updateDiffuseLevel = true;
    container.incrementModificationCount();
}

function Material_SpecularLevelModifiedCB(attribute, container)
{
    container.updateSpecularLevel = true;
    container.incrementModificationCount();
}

function Material_EmissiveLevelModifiedCB(attribute, container)
{
    container.updateEmissiveLevel = true;
    container.incrementModificationCount();
}

function Material_AmbientModifiedCB(attribute, container)
{
    container.updateAmbient = true;
    container.incrementModificationCount();
}
    
function Material_DiffuseModifiedCB(attribute, container)
{
    container.updateDiffuse = true;
    container.incrementModificationCount();
}
    
function Material_SpecularModifiedCB(attribute, container)
{
    container.updateSpecular = true;
    container.incrementModificationCount();
}
    
function Material_EmissiveModifiedCB(attribute, container)
{
    container.updateEmissive = true;
    container.incrementModificationCount();
}
    
function Material_GlossinessModifiedCB(attribute, container)
{
    container.updateGlosiness = true;
    container.incrementModificationCount();
}
    
function Material_OpacityModifiedCB(attribute, container)
{
    container.updateOpacity = true;
    container.incrementModificationCount();
}

function Material_DoubleSidedModifiedCB(attribute, container)
{
    container.incrementModificationCount();
}
Surface.prototype = new Isolator();
Surface.prototype.constructor = Surface;

function Surface()
{
    Isolator.call(this);
    this.className = "Surface";
    this.attrType = eAttrType.Surface;
    
    this.color = new ColorAttr(1, 1, 1, 1);
    this.ambientLevel = new NumberAttr(1);
    this.diffuseLevel = new NumberAttr(1);
    this.specularLevel = new NumberAttr(1);
    this.emissiveLevel = new NumberAttr(0);
    this.ambient = new ColorAttr(0.8, 0.8, 0.8, 1);
    this.diffuse = new ColorAttr(0.2, 0.2, 0.2, 1);
    this.specular = new ColorAttr(0, 0, 0, 1);
    this.emissive = new ColorAttr(0, 0, 0, 1);
    this.glossiness = new NumberAttr(0);
    this.opacity = new NumberAttr(1);
    this.doubleSided = new BooleanAttr(false);
    this.texturesEnabled = new BooleanAttr(true);
    this.colorTexturesPresent = new BooleanAttr(true);
    this.diffuseTexturesPresent = new BooleanAttr(true);
    this.luminosityTexturesPresent = new BooleanAttr(true);
    this.specularityTexturesPresent = new BooleanAttr(true);
    this.transparencyTexturesPresent = new BooleanAttr(true);
    this.numColorTextures = new NumberAttr(0);
    this.numDiffuseTextures = new NumberAttr(0);
    this.numLuminosityTextures = new NumberAttr(0);
    this.numSpecularityTextures = new NumberAttr(0);
    this.numTransparencyTextures = new NumberAttr(0);
    
    this.colorTexturesPresent.addModifiedCB(Surface_TexturesPresentModifiedCB, this);
    this.diffuseTexturesPresent.addModifiedCB(Surface_TexturesPresentModifiedCB, this);
    this.luminosityTexturesPresent.addModifiedCB(Surface_TexturesPresentModifiedCB, this);
    this.specularityTexturesPresent.addModifiedCB(Surface_TexturesPresentModifiedCB, this);
    this.transparencyTexturesPresent.addModifiedCB(Surface_TexturesPresentModifiedCB, this);

    this.registerAttribute(this.color, "color");
    this.registerAttribute(this.ambientLevel, "ambientLevel");
    this.registerAttribute(this.diffuseLevel, "diffuseLevel");
    this.registerAttribute(this.specularLevel, "specularLevel");
    this.registerAttribute(this.emissiveLevel, "emissiveLevel");
    this.registerAttribute(this.ambient, "ambient");
    this.registerAttribute(this.diffuse, "diffuse");
    this.registerAttribute(this.specular, "specular");
    this.registerAttribute(this.emissive, "emissive");
    this.registerAttribute(this.glossiness, "glossiness");
    this.registerAttribute(this.opacity, "opacity");
    this.registerAttribute(this.doubleSided, "doubleSided");
    this.registerAttribute(this.texturesEnabled, "texturesEnabled");
    this.registerAttribute(this.colorTexturesPresent, "colorTexturesPresent");
    this.registerAttribute(this.diffuseTexturesPresent, "diffuseTexturesPresent");
    this.registerAttribute(this.luminosityTexturesPresent, "luminosityTexturesPresent");
    this.registerAttribute(this.specularityTexturesPresent, "specularityTexturesPresent");
    this.registerAttribute(this.transparencyTexturesPresent, "transparencyTexturesPresent");
    this.registerAttribute(this.numColorTextures, "numColorTextures");
    this.registerAttribute(this.numDiffuseTextures, "numDiffuseTextures");
    this.registerAttribute(this.numLuminosityTextures, "numLuminosityTextures");
    this.registerAttribute(this.numSpecularityTextures, "numSpecularityTextures");
    this.registerAttribute(this.numTransparencyTextures, "numTransparencyTextures");

    this.isolateTextures.setValueDirect(true);

    this.materialNode = new Material();
    this.materialNode.getAttribute("name").setValueDirect("Material");
    this.addChild(this.materialNode);

    this.colorTexturesNode = new Group();
    this.colorTexturesNode.getAttribute("name").setValueDirect("Color Textures");
    this.addChild(this.colorTexturesNode);

    this.diffuseTexturesNode = new Group();
    this.diffuseTexturesNode.getAttribute("name").setValueDirect("Diffuse Textures");
    this.addChild(this.diffuseTexturesNode);

    this.luminosityTexturesNode = new Group();
    this.luminosityTexturesNode.getAttribute("name").setValueDirect("Luminosity Textures");
    this.addChild(this.luminosityTexturesNode);

    this.specularityTexturesNode = new Group();
    this.specularityTexturesNode.getAttribute("name").setValueDirect("Specularity Textures");
    this.addChild(this.specularityTexturesNode);

    this.transparencyTexturesNode = new Group();
    this.transparencyTexturesNode.getAttribute("name").setValueDirect("Transparency Textures");
    this.addChild(this.transparencyTexturesNode);

    this.connectMaterialAttributes(this.materialNode);
}

Surface.prototype.setGraphMgr = function(graphMgr)
{
    this.materialNode.setGraphMgr(graphMgr);
    this.colorTexturesNode.setGraphMgr(graphMgr);
    this.diffuseTexturesNode.setGraphMgr(graphMgr);
    this.luminosityTexturesNode.setGraphMgr(graphMgr);
    this.specularityTexturesNode.setGraphMgr(graphMgr);
    this.transparencyTexturesNode.setGraphMgr(graphMgr);
    
    // call base-class implementation
    Isolator.prototype.setGraphMgr.call(this, graphMgr);
}

Surface.prototype.update = function(params, visitChildren)
{
    // call base-class implementation
    Isolator.prototype.update.call(this, params, visitChildren);
}

Surface.prototype.apply = function(directive, params, visitChildren)
{
    // call base-class implementation
    Isolator.prototype.apply.call(this, directive, params, visitChildren);
}

Surface.prototype.connectMaterialAttributes = function(material)
{
    this.connectMaterialAttribute(material, this.color, "color");
    this.connectMaterialAttribute(material, this.ambientLevel, "ambientLevel");
    this.connectMaterialAttribute(material, this.diffuseLevel, "diffuseLevel");
    this.connectMaterialAttribute(material, this.specularLevel, "specularLevel");
    this.connectMaterialAttribute(material, this.emissiveLevel, "emissiveLevel");
    this.connectMaterialAttribute(material, this.ambient, "ambient");
    this.connectMaterialAttribute(material, this.diffuse, "diffuse");
    this.connectMaterialAttribute(material, this.specular, "specular");
    this.connectMaterialAttribute(material, this.emissive, "emissive");
    this.connectMaterialAttribute(material, this.glossiness, "glossiness");
    this.connectMaterialAttribute(material, this.opacity, "opacity");
    this.connectMaterialAttribute(material, this.doubleSided, "doubleSided");
}

Surface.prototype.connectMaterialAttribute = function(material, attribute, name)
{
    var modified = this.getAttributeModificationCount(attribute) > 0 ? true : false;
    attribute.addTarget(material.getAttribute(name), eAttrSetOp.Replace, null, modified);
}

Surface.prototype.addTexture = function(texture)
{
    // TODO
    this.colorTexturesNode.addChild(texture);
}

function Surface_TexturesPresentModifiedCB(attribute, container)
{
}
Model.prototype = new ParentableMotionElement();
Model.prototype.constructor = Model;

function Model()
{
    ParentableMotionElement.call(this);
    this.className = "Model";
    this.attrType = eAttrType.Model;
    
    this.geometryBBoxesMap = [];
    this.geometryAttrConnections = [];
    this.surfaceAttrConnections = [];

    this.url = new StringAttr("");
    this.layer = new NumberAttr(0);//0xffffffff);
    this.selectable = new BooleanAttr(true);
    this.moveable = new BooleanAttr(true);
    this.cullable = new BooleanAttr(true);
    this.show = new BooleanAttr(true);
    this.approximationLevels = new NumberAttr(1);
    this.showApproximationLevel = new NumberAttr(-1);
    this.sortPolygons = new BooleanAttr(false);
    this.flipPolygons = new BooleanAttr(false);
    this.intersector = new BooleanAttr(true);
    this.intersectee = new BooleanAttr(true);
    this.stationary = new BooleanAttr(false);
    this.shadowCaster = new BooleanAttr(false);
    this.shadowTarget = new BooleanAttr(true);
    this.indexedGeometry = new BooleanAttr(true);
    this.enableSharing = new BooleanAttr(true);
    this.vertices = new NumberArrayAttr();
    this.dissolve = new NumberAttr(0);
    this.color = new ColorAttr(1, 1, 1, 1);
    this.ambientLevel = new NumberAttr(1);
    this.diffuseLevel = new NumberAttr(1);
    this.specularLevel = new NumberAttr(1);
    this.emissiveLevel = new NumberAttr(0);
    this.ambient = new ColorAttr(0.8, 0.8, 0.8, 1);
    this.diffuse = new ColorAttr(0.2, 0.2, 0.2, 1);
    this.specular = new ColorAttr(0, 0, 0, 1);
    this.emissive = new ColorAttr(0, 0, 0, 1);
    this.glossiness = new NumberAttr(0);
    this.opacity = new NumberAttr(1);
    this.textureOpacity = new NumberAttr(1);
    this.doubleSided = new BooleanAttr(false);
    this.texturesEnabled = new BooleanAttr(true);
    this.pivotAboutGeometricCenter = new BooleanAttr(true);
    this.screenScaleEnabled = new BooleanAttr(false);
    this.screenScalePixels = new Vector3DAttr(0, 0, 0);

    this.show.addTarget(this.enabled);
    
    this.selectable.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.cullable.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.show.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.approximationLevels.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.showApproximationLevel.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.sortPolygons.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.sortPolygons.addModifiedCB(Model_SortPolygonsModifiedCB, this);
    this.flipPolygons.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.intersector.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.intersectee.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.stationary.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.shadowCaster.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.shadowTarget.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.renderSequenceSlot.addModifiedCB(Model_GeometryAttrModifiedCB, this);
    this.renderSequenceSlot.addModifiedCB(Model_RenderSequenceSlotModifiedCB, this);
    this.dissolve.addModifiedCB(Model_DissolveModifiedCB, this);
    this.color.addModifiedCB(Model_SurfaceAttrModifiedCB, this);
    this.ambientLevel.addModifiedCB(Model_SurfaceAttrModifiedCB, this);
    this.diffuseLevel.addModifiedCB(Model_SurfaceAttrModifiedCB, this);
    this.specularLevel.addModifiedCB(Model_SurfaceAttrModifiedCB, this);
    this.emissiveLevel.addModifiedCB(Model_SurfaceAttrModifiedCB, this);
    this.ambient.addModifiedCB(Model_SurfaceAttrModifiedCB, this);
    this.diffuse.addModifiedCB(Model_SurfaceAttrModifiedCB, this);
    this.specular.addModifiedCB(Model_SurfaceAttrModifiedCB, this);
    this.emissive.addModifiedCB(Model_SurfaceAttrModifiedCB, this);
    this.glossiness.addModifiedCB(Model_SurfaceAttrModifiedCB, this);
    this.opacity.addModifiedCB(Model_SurfaceAttrModifiedCB, this);
    this.opacity.addModifiedCB(Model_OpacityModifiedCB, this);
    this.textureOpacity.addModifiedCB(Model_TextureOpacityModifiedCB, this);
    this.doubleSided.addModifiedCB(Model_SurfaceAttrModifiedCB, this);
    this.texturesEnabled.addModifiedCB(Model_SurfaceAttrModifiedCB, this);

    this.registerAttribute(this.url, "url");
    this.registerAttribute(this.layer, "layer");
    this.registerAttribute(this.selectable, "selectable");
    this.registerAttribute(this.moveable, "moveable");
    this.registerAttribute(this.cullable, "cullable");
    this.registerAttribute(this.show, "show");
    this.registerAttribute(this.approximationLevels, "approximationLevels");
    this.registerAttribute(this.showApproximationLevel, "showApproximationLevel");
    this.registerAttribute(this.sortPolygons, "sortPolygons");
    this.registerAttribute(this.flipPolygons, "flipPolygons");
    this.registerAttribute(this.intersector, "intersector");
    this.registerAttribute(this.intersectee, "intersectee");
    this.registerAttribute(this.stationary, "stationary");
    this.registerAttribute(this.shadowCaster, "shadowCaster");
    this.registerAttribute(this.shadowTarget, "shadowTarget");
    this.registerAttribute(this.indexedGeometry, "indexedGeometry");
    this.registerAttribute(this.enableSharing, "enableSharing");
    this.registerAttribute(this.vertices, "vertices");
    this.registerAttribute(this.dissolve, "dissolve");
    this.registerAttribute(this.color, "color");
    this.registerAttribute(this.ambientLevel, "ambientLevel");
    this.registerAttribute(this.diffuseLevel, "diffuseLevel");
    this.registerAttribute(this.specularLevel, "specularLevel");
    this.registerAttribute(this.emissiveLevel, "emissiveLevel");
    this.registerAttribute(this.ambient, "ambient");
    this.registerAttribute(this.diffuse, "diffuse");
    this.registerAttribute(this.specular, "specular");
    this.registerAttribute(this.emissive, "emissive");
    this.registerAttribute(this.glossiness, "glossiness");
    this.registerAttribute(this.opacity, "opacity");
    this.registerAttribute(this.textureOpacity, "textureOpacity");
    this.registerAttribute(this.doubleSided, "doubleSided");
    this.registerAttribute(this.texturesEnabled, "texturesEnabled");
    this.registerAttribute(this.pivotAboutGeometricCenter, "pivotAboutGeometricCenter");
    this.registerAttribute(this.screenScaleEnabled, "screenScaleEnabled");
    this.registerAttribute(this.screenScalePixels, "screenScalePixels");
    
    this.isolatorNode = new Isolator();
    this.isolatorNode.getAttribute("name").setValueDirect("Isolator");
    this.isolatorNode.getAttribute("isolateDissolves").setValueDirect(true);
    //this.isolatorNode.setCreatedByParent(true);
    this.addChild(this.isolatorNode);

    this.dissolveNode = new Dissolve();
    this.dissolveNode.getAttribute("name").setValueDirect("Dissolve");
    this.addChild(this.dissolveNode);
    this.dissolve.addTarget(this.dissolveNode.getAttribute("dissolve"));
    //this.dissolve.setCreatedByParent(true);

    this.surfacesNode = new Group();
    this.surfacesNode.getAttribute("name").setValueDirect("Surfaces");
    this.addChild(this.surfacesNode);

    // enable auto-display lists
    this.autoDisplayList.setValueDirect(true);
    this.autoDisplayList.addModifiedCB(Model_AutoDisplayListModifiedCB, this);

    //this.surfacesNode.setCreatedByParent(true);
}

Model.prototype.copyModel = function(clone,cloneChildren,pathSrc,pathClone)
{
    var clonedByThis = false;
    if(!clone)
    {
        if (!(clone = new Model()))
        {
            return -1;
        }

        clonedByThis = true;
    }

    // call base-class implementation
    if (this.copyNode(clone, cloneChildren, pathSrc, pathClone))
    {
        return -1;
    }
}

/*Model.prototype.postClone = function(clone,pathSrc,pathClone)
{
    var i;
    var j;
    var node;
    var type;
    // setup uv-coords for cloned vertex geometry

    // find vertex geometry nodes under this node
    var names = [];
    var types = [];
    if (!(types.push(eAttrType.TriList))) return;
    if (!(types.push(eAttrType.LineList))) return;
    if (!(types.push(eAttrType.PointList))) return;
    var vertexGeometryNodes = [];
    this.searchTree(names, types, false, true, false, null, null, null, vertexGeometryNodes);
    //if (!(types.push(eAttrType.IndexedTriList))) return;
    //if (!(Push_Back<eAttrType>(types, eAttrType_Node_IndexedLineList))) return;
    //if (!(Push_Back<eAttrType>(types, eAttrType_Node_IndexedPointList))) return;


    // find vertex geometry nodes under the clone
    var vertexGeometryNodesClone = [];
    for (i=0; i < pathClone.length(); i++)
    {
        node = pathClone.stack[i];
        type = node.getAttribute();
        if (type == eAttrType.TriList ||
            type == eAttrType.LineList ||
            type == eAttrType.PointList)
//            type == eAttrType_Node_IndexedTriList ||
//            type == eAttrType_Node_IndexedLineList ||
//            type == eAttrType_Node_IndexedPointList)
        {
            if (!(vertexGeometryNodesClone.push(node))) return;
        }
    }

    // find media texture nodes affecting this node
    var textureNodes = [];
    this.searchTree(null, eAttrType.MediaTexture, false, true, false, null, null, null, textureNodes);

    // find media texture nodes affecting the clone
    var textureNodesClone = [];
    for (i=0; i < pathClone.length(); i++)
    {
        node = pathClone.stack[i];
        if (node.getAttribute() == eAttrType.MediaTexture)
        {
            if (!(textureNodesClone.push(node))) return;
        }
    }

    // for each vertex geometry node
    for (i=0; i < vertexGeometryNodes.size(); i++)
    {
        // for each texture node, setup the uv-coords
        var uvCoords = new NumberArrayAttr();
        for (j=0; j < textureNodes.size() && j < textureNodesClone.size(); j++)
        {
            uvCoords = vertexGeometryNodes[i].findUVCoords(textureNodes[j]);
            if (uvCoords)
            {
                var uvCoords2 = new NumberArrayAttr();
                uvCoords2 = vertexGeometryNodesClone[i].getUVCoords(textureNodesClone[j]);
                if (uvCoords2) uvCoords2.copyValue(uvCoords);
            }
        }
    }

    // setup m_geometry, m_geometryIndicesMap, m_geometryBBoxesMap, and m_surfaceNameMap
    var modelClone = clone;

    // find geometry nodes under the clone
    var geometryNodesClone = [];
    clone.searchesTree(names, types, false, true, false, null, null, null, geometryNodesClone);

    // synchronize m_geometryAttrConnections using "OR" operation (this will ensure attributes set inline on the clone are not lost)
    //std::vector<std::pair<CAttribute*, bool> >::const_iterator it;
    //this.geometryAttrConnections[]
    //std::vector<std::pair<CAttribute*, bool> >::iterator clone_it;
    */
   /* for (it = m_geometryAttrConnections.begin(), clone_it = modelClone->m_geometryAttrConnections.begin();
         it != m_geometryAttrConnections.end(), clone_it != modelClone->m_geometryAttrConnections.end();
         it++, clone_it++)*/
    /*for(var i = 0;i<this.geometryAttrConnections.length;i++)
    {
        // if this node has had a geometry attribute set, and the clone has not, copy the value from this
        if (it->second && !clone_it->second)
        {
            clone_it->first->CopyValue(it->first);
        }

        clone_it->second = clone_it->second | it->second;
    }

    var geometry;
    var srcGeometry;
    var srcIndices = [];
    const std::pair<CVector3Df, CVector3Df>* srcBBox;
    for (i=0; i < geometryNodesClone.size(); i++)
    {
        geometry = geometryNodesClone[i];

        srcGeometry = GetGeometry(i);
        srcIndices = GetGeometryIndices(srcGeometry);
        srcBBox = GetGeometryBBox(srcGeometry);

        if (!(Push_Back<GcGeometry*>(modelClone->m_geometry, geometry))) return;
        if (srcIndices) modelClone.m_geometryIndicesMap[geometry] = *srcIndices;
        if (srcBBox) modelClone->m_geometryBBoxesMap[geometry] = *srcBBox;

        modelClone->UpdateGeometryAttrConnections(geometry, true);
        modelClone->AddGeometryBBox(geometry);
    }

    // find surface nodes under the clone
    var surfaceNodesClone = [];
    clone.searchTree(null, eAttrType.Surface, false, true, false, null, null, null, surfaceNodesClone);

    // synchronize m_surfaceAttrConnectionsMap using "OR" operation (this will ensure attributes set inline on the clone are not lost)
    for (it = m_surfaceAttrConnections.begin(), clone_it = modelClone->m_surfaceAttrConnections.begin();
         it != m_surfaceAttrConnections.end(), clone_it != modelClone->m_surfaceAttrConnections.end();
         it++, clone_it++)
    {
        // if this node has had a surface attribute set, and the clone has not, copy the value from this
        if (it->second && !clone_it->second)
        {
            clone_it->first->CopyValue(it->first);
        }

        clone_it->second = clone_it->second | it->second;
    }

    var surface;
    for (i=0; i < surfaceNodesClone.size(); i++)
    {
        surface = surfaceNodesClone[i];

        modelClone->m_surfaceNameMap[surface->GetName()->GetValueDirect(buffer, sizeof(buffer))] = surface;

        // register surface to this for accessiblity with Set
        modelClone->RegisterAttribute(surface, buffer);
        if (surface.getContainer() == modelClone)
        {
            // don't want modelClone to be the registered container for the surface otherwise it will be released
            // when unregistered
            surface.setContainer(null);
        }

        modelClone->UpdateSurfaceAttrConnections(surface, true);
    }

    // call base-class implementation
    this.postClone(clone, pathSrc, pathClone);
}
*/
Model.prototype.initializeSurfaceAttrConnectionsMap = function()
{
    this.surfaceAttrConnections.push(new Pair(this.color, false));
    this.surfaceAttrConnections.push(new Pair(this.ambientLevel, false));
    this.surfaceAttrConnections.push(new Pair(this.diffuseLevel, false));
    this.surfaceAttrConnections.push(new Pair(this.specularLevel, false));
    this.surfaceAttrConnections.push(new Pair(this.emissiveLevel, false));
    this.surfaceAttrConnections.push(new Pair(this.ambient, false));
    this.surfaceAttrConnections.push(new Pair(this.diffuse, false));
    this.surfaceAttrConnections.push(new Pair(this.specular, false));
    this.surfaceAttrConnections.push(new Pair(this.emissive, false));
    this.surfaceAttrConnections.push(new Pair(this.glossiness, false));
    this.surfaceAttrConnections.push(new Pair(this.opacity, false));
    this.surfaceAttrConnections.push(new Pair(this.doubleSided, false));
    this.surfaceAttrConnections.push(new Pair(this.texturesEnabled, false));
    this.surfaceAttrConnections.push(new Pair(this.renderSequenceSlot, false));
}

Model.prototype.initializeGeometryAttrConnectionsMap = function()
{
    this.geometryAttrConnections.push(new Pair(this.selectable, false));
    this.geometryAttrConnections.push(new Pair(this.cullable, false));
    this.geometryAttrConnections.push(new Pair(this.show, false));
    this.geometryAttrConnections.push(new Pair(this.approximationLevels, false));
    this.geometryAttrConnections.push(new Pair(this.showApproximationLevel, false));
    this.geometryAttrConnections.push(new Pair(this.sortPolygons, false));
    this.geometryAttrConnections.push(new Pair(this.flipPolygons, false));
    this.geometryAttrConnections.push(new Pair(this.intersector, false));
    this.geometryAttrConnections.push(new Pair(this.intersectee, false));
    this.geometryAttrConnections.push(new Pair(this.stationary, false));
    this.geometryAttrConnections.push(new Pair(this.shadowCaster, false));
    this.geometryAttrConnections.push(new Pair(this.shadowTarget, false));
}

Model.prototype.clearSurfaceAttrConnectionMap = function()
{
    this.surfaceAttrConnections = [];

    this.initializeSurfaceAttrConnectionsMap();
}

Model.prototype.clearGeometryAttrConnectionsMap = function()
{
    this.geometryAttrConnections = [];

    this.initializeGeometryAttrConnectionsMap();
}

Model.prototype.setGraphMgr = function(graphMgr)
{
    this.isolatorNode.setGraphMgr(graphMgr);
    this.dissolveNode.setGraphMgr(graphMgr);
    this.surfacesNode.setGraphMgr(graphMgr);
    
    // call base-class implementation
    ParentableMotionElement.prototype.setGraphMgr.call(this, graphMgr);
}

Model.prototype.update = function(params, visitChildren)
{
    // call base-class implementation
    ParentableMotionElement.prototype.update.call(this, params, visitChildren);
}

Model.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }

    switch (directive)
    {
        case "render":
            {
                var show = this.show.getValueDirect();
                if (!show)
                {
                    // call base-class implementation
                    ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);
                    return;
                }

                this.pushMatrix();

                this.applyTransform();

                // call base-class implementation
                ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);

                this.popMatrix();
            }
            break;

        case "rayPick":
            {
                var lastWorldMatrix = new Matrix4x4();
                lastWorldMatrix.loadMatrix(params.worldMatrix);
                var lastSectorOrigin = new Vector3D(params.sectorOrigin.x, params.sectorOrigin.y, params.sectorOrigin.z);

                params.worldMatrix = params.worldMatrix.multiply(this.sectorTransformCompound);
                params.sectorOrigin.load(this.sectorOrigin.getValueDirect());

                // call base-class implementation
                ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);

                params.worldMatrix.loadMatrix(lastWorldMatrix);
                params.sectorOrigin.copy(lastSectorOrigin);
            }
            break;

        case "bbox":
            {
                var lastWorldMatrix = new Matrix4x4();
                lastWorldMatrix.loadMatrix(params.worldMatrix);
                params.worldMatrix.loadMatrix(this.sectorTransformCompound.multiply(params.worldMatrix));

                // call base-class implementation
                ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);

                params.worldMatrix.loadMatrix(lastWorldMatrix);
            }
            break;

        default:
            {
                // call base-class implementation
                ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);
            }
            break;
    }
}

Model.prototype.pushMatrix = function()
{
	this.graphMgr.renderContext.setMatrixMode(RC_MODELVIEW);
    this.graphMgr.renderContext.pushMatrix();
}

Model.prototype.popMatrix = function()
{
    this.graphMgr.renderContext.setMatrixMode(RC_MODELVIEW);
    this.graphMgr.renderContext.popMatrix();
    this.graphMgr.renderContext.applyModelViewTransform();    
}

Model.prototype.addSurface = function(surface)
{
    this.surfacesNode.addChild(surface);
    
    // register surface to this for accessiblity with Set
    this.registerAttribute(surface, surface.getAttribute("name").getValueDirect().join(""));
	
    this.connectSurfaceAttributes(surface);
}

Model.prototype.addGeometry = function(geometry, surface)
{
    surface.addChild(geometry);
    
    this.connectGeometryAttributes(geometry);
    this.addGeometryBBox(geometry);
}

Model.prototype.addIndexedGeometry = function(geometry, indices, surface)
{
    this.addGeometry(geometry, surface);
    
    // TODO: what to do with indices?
}

Model.prototype.connectSurfaceAttributes = function(surface)
{
    this.connectSurfaceAttribute(surface, this.color, "color");
    this.connectSurfaceAttribute(surface, this.ambientLevel, "ambientLevel");
    this.connectSurfaceAttribute(surface, this.diffuseLevel, "diffuseLevel");
    this.connectSurfaceAttribute(surface, this.specularLevel, "specularLevel");
    this.connectSurfaceAttribute(surface, this.emissiveLevel, "emissiveLevel");
    this.connectSurfaceAttribute(surface, this.ambient, "ambient");
    this.connectSurfaceAttribute(surface, this.diffuse, "diffuse");
    this.connectSurfaceAttribute(surface, this.specular, "specular");
    this.connectSurfaceAttribute(surface, this.emissive, "emissive");
    this.connectSurfaceAttribute(surface, this.glossiness, "glossiness");
    this.connectSurfaceAttribute(surface, this.opacity, "opacity");
    this.connectSurfaceAttribute(surface, this.doubleSided, "doubleSided");
    this.connectSurfaceAttribute(surface, this.texturesEnabled, "texturesEnabled");
    this.connectSurfaceAttribute(surface, this.enabled, "enabled");
}

Model.prototype.connectSurfaceAttribute = function(surface, attribute, name)
{
    var modified = this.getAttributeModificationCount(attribute) > 0 ? true : false;
    attribute.addTarget(surface.getAttribute(name), eAttrSetOp.Replace, null, modified);
}

Model.prototype.connectGeometryAttributes = function(geometry)
{
    this.connectGeometryAttribute(geometry, this.selectable, "selectable");
    this.connectGeometryAttribute(geometry, this.cullable, "cullable");
    this.connectGeometryAttribute(geometry, this.show, "show");
    this.connectGeometryAttribute(geometry, this.approximationLevels, "approximationLevels");
    this.connectGeometryAttribute(geometry, this.showApproximationLevel, "showApproximationLevel");
    this.connectGeometryAttribute(geometry, this.sortPolygons, "sortPolygons");
    this.connectGeometryAttribute(geometry, this.flipPolygons, "flipPolygons");
    this.connectGeometryAttribute(geometry, this.intersector, "intersector");
    this.connectGeometryAttribute(geometry, this.intersectee, "intersectee");
    this.connectGeometryAttribute(geometry, this.stationary, "stationary");
    this.connectGeometryAttribute(geometry, this.shadowCaster, "shadowCaster");
    this.connectGeometryAttribute(geometry, this.shadowTarget, "shadowTarget");
    this.connectGeometryAttribute(geometry, this.renderSequenceSlot, "renderSequenceSlot");
}

Model.prototype.connectGeometryAttribute = function(geometry, attribute, name)
{
    var modified = this.getAttributeModificationCount(attribute) > 0 ? true : false;
    attribute.addTarget(geometry.getAttribute(name), eAttrSetOp.Replace, null, modified);
}

Model.prototype.addGeometryBBox = function(geometry)
{
    if (geometry == null ||
        geometry == undefined)
        return;
    
    geometry.bbox.min.addModifiedCB(Model_GeometryBBoxModifiedCB, this);
    geometry.bbox.max.addModifiedCB(Model_GeometryBBoxModifiedCB, this);

    this.updateGeometryBBox(geometry);
}

Model.prototype.updateGeometryBBox = function(geometry)
{
    if (geometry == null ||
        geometry == undefined)
        return;
    
    var min = geometry.bbox.min.getValueDirect();
    var max = geometry.bbox.max.getValueDirect();
    
    this.geometryBBoxesMap[geometry] = new Pair(min, max);
    
    this.updateBBox();
}

Model.prototype.updateBBox = function()
{
    var min = new Vector3D();
    var max = new Vector3D();
    var first = true;
    for (var i in this.geometryBBoxesMap)
    {
        if (first)
        {
            min.x = this.geometryBBoxesMap[i].first.x;
            min.y = this.geometryBBoxesMap[i].first.y;
            min.z = this.geometryBBoxesMap[i].first.z;
            
            max.x = this.geometryBBoxesMap[i].second.x;
            max.y = this.geometryBBoxesMap[i].second.y;
            max.z = this.geometryBBoxesMap[i].second.z;
            
            first = false;
            continue;
        }
        
        min.x = Math.min(min.x, this.geometryBBoxesMap[i].first.x);
        min.y = Math.min(min.y, this.geometryBBoxesMap[i].first.y);
        min.z = Math.min(min.z, this.geometryBBoxesMap[i].first.z);
        
        max.x = Math.max(max.x, this.geometryBBoxesMap[i].second.x);
        max.y = Math.max(max.y, this.geometryBBoxesMap[i].second.y);
        max.z = Math.max(max.z, this.geometryBBoxesMap[i].second.z);
    }
    
    this.bbox.min.setValueDirect(min.x, min.y, min.z);
    this.bbox.max.setValueDirect(max.x, max.y, max.z);
    
    var center = new Vector3D((min.x + max.x) / 2.0,
                              (min.y + max.y) / 2.0,
                              (min.z + max.z) / 2.0);
                              
    this.center.setValueDirect(center.x, center.y, center.z);
}

Model.prototype.autoDisplayListModified = function()
{
    
}

function Model_AutoDisplayListModifiedCB(attribute, container)
{
    container.autoDisplayListModified();
}

function Model_SortPolygonsModifiedCB(attribute, container)
{
    // TODO
    //container.sortPolygonsModified();
}
    
function Model_RenderSequenceSlotModifiedCB(attribute, container)
{
    var slot = attribute.getValueDirect();

    // if render seqence slot is non-zero, cannot use display lists
    if (slot > 0)
    {
        container.autoDisplayList.setValueDirect(false);
        container.enableDisplayList.setValueDirect(false);
    }
}

function Model_DissolveModifiedCB(attribute, container)
{
    var dissolve = attribute.getValueDirect();

    if (dissolve > 0)
    {
        container.autoDisplayList.setValueDirect(false);
        container.enableDisplayList.setValueDirect(false);
    }

    //this.updateDisableOnDissolve(); // TODO
}

function Model_OpacityModifiedCB(attribute, container)
{
    var opacity = attribute.getValueDirect();
    
    // if opacity is less than 1, cannot use display lists
    if (opacity < 1)
    {
        container.autoDisplayList.setValueDirect(false);
        container.enableDisplayList.setValueDirect(false);
    }
}

function Model_TextureOpacityModifiedCB(attribute, container)
{
    //container.textureOpacityModified();
}

function Model_Surface_NumTransparencyTexturesModifiedCB(attribute, container)
{
    var numTransparencyTextures = attribute.getValueDirect();
    
    // if count is greater than 0, cannot use display lists
    if (numTransparencyTextures > 0)
    {
        container.autoDisplayList.setValueDirect(false);
        container.enableDisplayList.setValueDirect(false);
    }
}

function Model_GeometryBBoxModifiedCB(attribute, container)
{
    container.updateGeometryBBox(attribute.getContainer().getContainer());
}

function Model_SurfaceAttrModifiedCB(attribute, container)
{
    //container.incrementModificationCount();
}

function Model_GeometryAttrModifiedCB(attribute, container)
{
    //container.incremementModificationCount();
}
Texture.prototype = new ParentableMotionElement();
Texture.prototype.constructor = Texture;

function Texture()
{
    ParentableMotionElement.call(this);
    this.className = "Texture";
    this.attrType = eAttrType.Texture;
   
    this.updateImage = false;
    this.updateTextureType = false;
    this.updateMipmappingEnabled = false;
    this.setImage = false;
    this.imageSet = false;
    this.textureObj = null;
    this.pitch = 0;
    
    this.image = new ImageAttr(); 
    this.opacity = new NumberAttr(1);
    this.textureType = new NumberAttr(eTextureType.Color);
    this.widthWrap = new NumberAttr(eTextureWrap.None);
    this.heightWrap = new NumberAttr(eTextureWrap.None);
    this.mipmappingEnabled = new BooleanAttr(false);
    
    this.image.getAttribute("width").addModifiedCB(Texture_ImageModifiedCB, this);
    this.image.getAttribute("height").addModifiedCB(Texture_ImageModifiedCB, this);
    this.image.getAttribute("byteAlignment").addModifiedCB(Texture_ImageModifiedCB, this);
    this.image.getAttribute("pixelFormat").addModifiedCB(Texture_ImageModifiedCB, this);
    this.image.getAttribute("pixels").addModifiedCB(Texture_ImagePixelsModifiedCB, this);
    this.textureType.addModifiedCB(Texture_TextureTypeModifiedCB, this);
    this.opacity.addModifiedCB(Texture_OpacityModifiedCB, this);
    this.widthWrap.addModifiedCB(Texture_WrapModifiedCB, this);
    this.heightWrap.addModifiedCB(Texture_WrapModifiedCB, this);
    this.mipmappingEnabled.addModifiedCB(Texture_MipmappingEnabledModifiedCB, this);

    this.registerAttribute(this.image, "image");
    this.registerAttribute(this.opacity, "opacity");
    this.registerAttribute(this.textureType, "textureType");
    this.registerAttribute(this.widthWrap, "widthWrap");
    this.registerAttribute(this.heightWrap, "heightWrap");
    this.registerAttribute(this.mipmappingEnabled, "mipmappingEnabled");
}

Texture.prototype.setGraphMgr = function(graphMgr)
{
    // create texture object
    this.textureObj = graphMgr.renderContext.createTextureObject();
    
    // call base-class implementation
    ParentableMotionElement.prototype.setGraphMgr.call(this, graphMgr);
}

Texture.prototype.update = function(params, visitChildren)
{
    if (this.updateImage)
    {
        this.updateImage = false;

        this.setImage = true;
    }

    if (this.updateMipmappingEnabled)
    {
        // only reset image to use/not use mipmaps if image has been specified
        if (this.imageSet)
        {
            this.setImage = true;
            this.updateMipmappingEnabled = false;
        }
    }

    if (this.setImage)
    {
        this.setImage = !(this.SetImage());
    }

    // only call direct-base class implementation if position, rotation, or scale has been modified
    // (avoids unnecessary calculations for textures)
    if (this.updatePosition || this.updateRotation || this.updateScale)
    {
        ParentableMotionElement.prototype.update.call(this, params, visitChildren);
    }
    else
    {
        SGNode.prototype.update.call(this, params, visitChildren);
    }
}

Texture.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }

    switch (directive)
    {
        case "render":
            {
                // if texture is ready, add to texture array
                if (this.imageSet)
                {
                    var drawTextures = params.drawTextures && this.graphMgr.getDrawTextures();
                    if (drawTextures)
                    {
                        // TODO: if current projector object, add texture to projection texture array
                        var textures = this.graphMgr.textureArrayStack.top().textures;
                        var i = this.textureType.getValueDirect();
                        // Added this error handling when several scenes
                        // where textures[i] is undefined but have no
                        // idea why textures[i] is undefined - KMC
                        if (textures[i])
                        {
                            textures[i].push(this);
                        }
                    }
                }
                
            }
            break;
    }

    // call base-class implementation
    ParentableMotionElement.prototype.apply.call(this, directive, params, visitChildren);
}

Texture.prototype.SetImage = function()
{
    var width = this.image.width.getValueDirect();
    var height = this.image.height.getValueDirect();
    var pixelFormat = this.image.pixelFormat.getValueDirect();
    var pixels = this.image.pixels.getValueDirect();

    if (width == 0 ||
        height == 0 ||
        pixelFormat == ePixelFormat.Unknown ||
        pixels == null)
    {
        return false;
    }
    
    var imageFormat;
    switch (this.textureType.getValueDirect())
    {
        case eTextureType.Diffuse:
        case eTextureType.Luminosity:
        case eTextureType.Specularity:
        case eTextureType.Transparency:
            imageFormat = eImageFormat.Alpha;
            break;

        case eTextureType.Color:
        default:
            imageFormat = eImageFormat.RGBA;
            break;
    }

    this.textureObj.setImageData(width, height, pixelFormat, imageFormat, pixels);

    this.imageSet = true;
    
    return true;
}

function Texture_ImageModifiedCB(attribute, container)
{
    container.updateImage = true;
    container.incrementModificationCount();
}

function Texture_ImagePixelsModifiedCB(attribute, container)
{
    container.updateImage = true;
    container.incrementModificationCount();
}

function Texture_OpacityModifiedCB(attribute, container)
{
    container.incrementModificationCount();
}

function Texture_TextureTypeModifiedCB(attribute, container)
{
    container.updateTextureType = true;
    container.incrementModificationCount();
}

function Texture_WrapModifiedCB(attribute, container)
{
    container.incrementModificationCount();
}

function Texture_MipmappingEnabledModifiedCB(attribute, container)
{
    container.updateMipmappingEnabled = true;
    container.incrementModificationCount();
}
MediaTexture.prototype = new Texture();
MediaTexture.prototype.constructor = MediaTexture;

function MediaTexture()
{
    Texture.call(this);
    this.className = "MediaTexture";
    this.attrType = eAttrType.MediaTexture;
    
    this.updateImageFilename = false;
    this.updateAlphaFilename = false;
    this.updateNegateImage = false;
    this.updateNegateAlpha = false;
    this.imagePlayback = null;
    this.alphaPlayback = null;
    this.pixelMap = ePixelMap.Default;
    this.forceImageUpdate = false;
    
    this.imageFilename = new StringAttr("");
    this.alphaFilename = new StringAttr("");
    this.negateImage = new BooleanAttr(false);
    this.negateAlpha = new BooleanAttr(false);
    this.frame = new NumberAttr(-1);
    this.frameRetrieved = new NumberAttr(-1);
    
    this.imageFilename.addModifiedCB(MediaTexture_ImageFilenameModifiedCB, this);
    this.alphaFilename.addModifiedCB(MediaTexture_AlphaFilenameModifiedCB, this);
    this.negateImage.addModifiedCB(MediaTexture_NegateImageModifiedCB, this);
    this.negateAlpha.addModifiedCB(MediaTexture_NegateAlphaModifiedCB, this);
   
    this.registerAttribute(this.imageFilename, "imageFilename");
    this.registerAttribute(this.alphaFilename, "alphaFilename");
    this.registerAttribute(this.negateImage, "negateImage");
    this.registerAttribute(this.negateAlpha, "negateAlpha");
    this.registerAttribute(this.frame, "frame");
    this.registerAttribute(this.frameRetrieved, "frameRetrieved");
}

MediaTexture.prototype.setGraphMgr = function(graphMgr)
{
    // call base-class implementation
    Texture.prototype.setGraphMgr.call(this, graphMgr);
}

MediaTexture.prototype.update = function(params, visitChildren)
{
    if (this.updateImageFilename ||
        this.updateAlphaFilename)
    {
        this.updateImageFilename = false;
        this.updateAlphaFilename = false;

        this.frame.setValueDirect(-1);

        this.loadMedia();
    }

    if (this.updateTextureType)
    {
        this.updateTextureType = false;

        this.setImageSize();

        this.forceImageUpdate = true;
    }

    if (this.updateNegateImage)
    {
        this.updateNegateImage = false;

        this.forceImageUpdate = true;
    }

    if (this.updateNegateAlpha)
    {
        this.updateNegateAlpha = false;

        this.forceImageUpdate = true;
    }

    // update texture image if enabled
    if (this.enabled.getValueDirect())
    {
        this.updateMediaTextureImage();
    }

    // call base-class implementation
    Texture.prototype.update.call(this, params, visitChildren);
}

MediaTexture.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        Texture.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }

    // call base-class implementation
    Texture.prototype.apply.call(this, directive, params, visitChildren);
}

MediaTexture.prototype.loadMedia = function()
{
    var imageFilename = this.imageFilename.getValueDirect().join("");
    if (imageFilename &&
        imageFilename != "" &&
       !this.imagePlayback || (this.imagePlayback && this.imagePlayback.url != imageFilename))
    {
        this.imagePlayback = new MediaPlayback(this, MediaTexture_OnImageLoad);
        this.imagePlayback.container = this;
        this.imagePlayback.loadImage(imageFilename);
    }
    else if (imageFilename == "")
    {
        // TODO: remove texture
    }

    var alphaFilename = this.alphaFilename.getValueDirect().join("");
    if (alphaFilename &&
        alphaFilename != "" &&
       !this.alphaPlayback || (this.alphaPlayback && this.alphaPlayback.url != alphaFilename))
    {
        this.alphaPlayback = new MediaPlayback(this, MediaTexture_OnAlphaLoad);
        this.alphaPlayback.container = this;
        this.alphaPlayback.loadImage(alphaFilename);

        if (this.imagePlayback)
        {
            this.imagePlayback.setAlphaChannel(this.alphaPlayback);
        }
    }
    else if (alphaFilename == "")
    {
        // TODO: remove texture
    }
    
    // increment modification count
    this.incrementModificationCount();
}

MediaTexture.prototype.setImageSize = function()
{
    // only perform this action if texture type is not color and/or an alpha channel is present
    if (this.textureType.getValueDirect() == eTextureType.Color &&
       !this.alphaPlayback)
    {
        return;
    }

    if (!this.imagePlayback)
    {
        return;
    }

    // get image playback dimensions
    var dims = this.imagePlayback.getFrameDimensions();
    var width = nextHighestPowerOfTwo(dims.width);
    var height = nextHighestPowerOfTwo(dims.height);

    // based on texture type, determine pixel format
    var pixelFormat;
    switch (this.textureType.getValueDirect())
    {
        case eTextureType.Diffuse:
        case eTextureType.Luminosity:
        case eTextureType.Specularity:
        case eTextureType.Transparency:
        case eTextureType.Clip:
            pixelFormat = ePixelFormat.A8;
            this.pixelMap = ePixelMap.RGBToAlpha;
            break;

        case eTextureType.Color:
        default:
            pixelFormat = this.imagePlayback.getPixelFormat();
            this.pixelMap = ePixelMap.Default;
            break;
    }

    // if alpha playback, ensure pixel format has an alpha channel
    if (this.alphaPlayback)
    {
        switch (pixelFormat)
        {
            case ePixelFormat.R8G8B8:
                pixelFormat = ePixelFormat.R8G8B8A8;
                break;

            case ePixelFormat.B8G8R8:
                pixelFormat = ePixelFormat.B8G8R8A8;
                break;
        }
    }

    // get image playback byte alignment
    var byteAlignment = this.imagePlayback.getPixelByteAlignment();

    // calculate pitch
    this.pitch = width * BytesPerPixel(pixelFormat);
    this.pitch += (byteAlignment - this.pitch % byteAlignment) % byteAlignment;

    // set image attributes
    this.image.width.setValueDirect(width);
    this.image.height.setValueDirect(height);
    this.image.pixelFormat.setValueDirect(pixelFormat);
    this.image.byteAlignment.setValueDirect(byteAlignment);

    // allocate pixel buffer
    this.image.pixels.setLength(height * this.pitch);
}

MediaTexture.prototype.updateMediaTextureImage = function()
{
    // only perform this action if texture type is not color and an alpha channel is present
    if (this.textureType.getValueDirect() == eTextureType.Color &&
       !this.alphaPlayback)
    {
        return;
    }
    
    if (this.imagePlayback &&
        this.imagePlayback.ready &&
       (this.imagePlayback.newFrameDataAvailable() ||
       (this.alphaPlayback && this.alphaPlayback.newFrameDataAvailable()) ||
        this.forceImageUpdate))
    {
        var width = this.image.width.getValueDirect();
        var height = this.image.height.getValueDirect();
        var pixelFormat = this.image.pixelFormat.getValueDirect();

        // set filter mask
        var filterMask = FRAME_FILTER_SCALE_FRAME_BIT;
        if (this.negateImage.getValueDirect())
        {
            filterMask |= FRAME_FILTER_NEGATE_COLOR_BIT;
        }
        if (this.negateAlpha.getValueDirect())
        {
            filterMask |= FRAME_FILTER_NEGATE_ALPHA_BIT;
        }

        // get image data
        var frameRetrieved = this.imagePlayback.getFrameData(width, height, this.pitch, pixelFormat, this.image.pixels.values, filterMask, this.pixelMap, this.frame.getValueDirect());
        this.frameRetrieved.setValueDirect(frameRetrieved);

        this.forceImageUpdate = false;
    }
    
    // increment modification count
    this.incrementModificationCount();
}

MediaTexture.prototype.onImageLoad = function()
{
    // only perform this action if texture type is not color and/or an alpha channel is present
    if (this.textureType.getValueDirect() == eTextureType.Color &&
       !this.alphaPlayback)
    {
        this.textureObj.setImage(this.imagePlayback.htmlImageElement, ePixelFormat.R8G8B8, eImageFormat.RGB);
        this.imageSet = true;
        this.incrementModificationCount();
        return;
    }
    
    this.setImageSize();
}

MediaTexture.prototype.onAlphaLoad = function()
{
}

MediaTexture.prototype.onVideoLoad = function()
{   /*
    var image = this.htmlImageElement;
    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");
    canvas.width = 200; //image.width;
    canvas.height = 200; //image.height;
    canvasContext.drawImage(image, 0, 0);
    var imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
    this.textureObj.setImageData(imageData);
    this.imageSet = true;
    this.video = true;
    //alert(imageData.data[0]);
    //alert(imageData.data[1]);
    //alert(imageData.data[2]);
    //alert(imageData.data[3]);
    */
    this.textureObj.setVideo(this.htmlImageElement);
    this.textureObj.negate = this.negateImage.getValueDirect();
    this.imageSet = true;
}

function MediaTexture_OnImageLoad()
{
    this.container.onImageLoad();
}

function MediaTexture_OnAlphaLoad()
{
    this.container.onAlphaLoad();
}

function MediaTexture_OnVideoLoad()
{
    alert("MediaTexture_OnVideoLoad");
    this.container.onVideoLoad();
}

function MediaTexture_ImageFilenameModifiedCB(attribute, container)
{
    container.updateImageFilename = true;
    container.incrementModificationCount();
}

function MediaTexture_AlphaFilenameModifiedCB(attribute, container)
{
    container.updateAlphaFilename = true;
    container.incrementModificationCount();
}

function MediaTexture_NegateImageModifiedCB(attribute, container)
{
    container.updateNegateImage = true;
    container.incrementModificationCount();
}

function MediaTexture_NegateAlphaModifiedCB(attribute, container)
{
    container.updateNegateAlpha = true;
    container.incrementModificationCount();
}
Evaluator.prototype = new Node();
Evaluator.prototype.constructor = Evaluator;

function Evaluator()
{
    Node.call(this);
    this.className = "Evaluator";
    this.attrType = eAttrType.Evaluator;
    
    this.expired = new BooleanAttr(false);
    
    this.registerAttribute(this.expired, "expired");
}

Evaluator.prototype.evaluate = function()
{
}

Evaluator.prototype.update = function(params, visitChildren)
{
    // evaluate if evaluator is "enabled" and has not "expired"
    var enabled = this.enabled.getValueDirect();
    var expired = this.expired.getValueDirect();
    if (enabled && !expired)
    {
        this.evaluate();
    }
    
    // call base-class implementation
    Node.prototype.update.call(this, params, visitChildren);
}
SceneInspector.prototype = new Evaluator();
SceneInspector.prototype.constructor = SceneInspector;

function SceneInspector()
{
    Evaluator.call(this);
    this.className = "SceneInspector";
    this.attrType = eAttrType.SceneInspector;
    
    this.viewPosition = new Vector3DAttr(0, 0, 0);
    this.viewRotation = new Vector3DAttr(0, 0, 0);
    this.translationDelta = new Vector3DAttr(0, 0, 0);
    this.panDelta = new Vector3DAttr(0, 0, 0);
    this.trackDelta = new Vector3DAttr(0, 0, 0);
    this.rotationDelta = new Vector3DAttr(0, 0, 0);
    this.viewRelativeXAxisRotation = new BooleanAttr(false);
    this.viewRelativeYAxisRotation = new BooleanAttr(false);
    this.viewRelativeZAxisRotation = new BooleanAttr(false);
    this.pivotDistance = new NumberAttr(0);
    this.pivotPointWorld = new Vector3DAttr(0, 0, 0);
    this.resultPosition = new Vector3DAttr(0, 0, 0);
    this.resultRotation = new Vector3DAttr(0, 0, 0);
    
    this.registerAttribute(this.viewPosition, "viewPosition");
    this.registerAttribute(this.viewRotation, "viewRotation");
    this.registerAttribute(this.translationDelta, "translationDelta");
    this.registerAttribute(this.panDelta, "panDelta");
    this.registerAttribute(this.trackDelta, "trackDelta");
    this.registerAttribute(this.rotationDelta, "rotationDelta");
    this.registerAttribute(this.viewRelativeXAxisRotation, "viewRelativeXAxisRotation");
    this.registerAttribute(this.viewRelativeYAxisRotation, "viewRelativeYAxisRotation");
    this.registerAttribute(this.viewRelativeZAxisRotation, "viewRelativeZAxisRotation");
    this.registerAttribute(this.pivotDistance, "pivotDistance");
    this.registerAttribute(this.pivotPointWorld, "pivotPointWorld");
    this.registerAttribute(this.resultPosition, "resultPosition");
    this.registerAttribute(this.resultRotation, "resultRotation");
}

SceneInspector.prototype.evaluate = function()
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        return;
    }
    
    // get input values
    
    // view position
    var viewPosition = this.viewPosition.getValueDirect();
    
    // view rotation
    var viewRotation = this.viewRotation.getValueDirect();
    
    // translation delta
    var translationDelta = this.translationDelta.getValueDirect();
    
    // pan delta
    var panDelta = this.panDelta.getValueDirect();
    
    // track delta
    var trackDelta = this.trackDelta.getValueDirect();
    
    // rotation delta
    var rotationDelta = this.rotationDelta.getValueDirect();
    
    // view-relative rotation flags
    var viewRelativeXAxisRotation = this.viewRelativeXAxisRotation.getValueDirect();
    var viewRelativeYAxisRotation = this.viewRelativeYAxisRotation.getValueDirect();
    var viewRelativeZAxisRotation = this.viewRelativeZAxisRotation.getValueDirect();
    
    // pivot distance
    var pivotDistance = this.pivotDistance.getValueDirect();
    
    // formulate view transform
    var viewTrans = new Matrix4x4();
    viewTrans.loadTranslation(-viewPosition.x, -viewPosition.y, -viewPosition.z);
    var viewRot = new Matrix4x4();
    viewRot.loadXYZAxisRotation(-viewRotation.x, -viewRotation.y, -viewRotation.z);
    var viewTransform = viewTrans.multiply(viewRot);

    // calculate camera direction vectors
    var cameraUp = this.transformDirectionVector(0, 1, 0, viewTransform);
    var cameraRight = this.transformDirectionVector(1, 0, 0, viewTransform);
    var cameraForward = this.transformDirectionVector(0, 0, 1, viewTransform);
    
    // set rotation matrix
    var sceneRotX = new Matrix4x4();
    var sceneRotY = new Matrix4x4();
    var sceneRotZ = new Matrix4x4();
    // x
    if (viewRelativeXAxisRotation)
    {
        sceneRotX.loadRotation(cameraRight.x, cameraRight.y, cameraRight.z, -rotationDelta.x);
    }
    else
    {
        sceneRotX.loadXAxisRotation(-rotationDelta.x);
    }
    // y
    if (viewRelativeYAxisRotation)
    {
        sceneRotY.loadRotation(cameraUp.x, cameraUp.y, cameraUp.z, -rotationDelta.y);
    }
    else
    {
        sceneRotY.loadYAxisRotation(-rotationDelta.y);
    }
    // z
    if (viewRelativeZAxisRotation)
    {
        sceneRotZ.loadRotation(cameraForward.x, cameraForward.y, cameraForward.z, -rotationDelta.z);
    }
    else
    {
        sceneRotZ.loadXAxisRotation(-rotationDelta.z);
    }
    var sceneRot = sceneRotY.multiply(sceneRotX.multiply(sceneRotZ)); // this multiplication order eliminates roll when x- and y-axis rotations are combined
    
    // set translation matrix
    var sceneTrans = new Matrix4x4();
    sceneTrans.loadTranslation(translationDelta.x, -translationDelta.y, -translationDelta.z);
    
    // set pan/track
    if (panDelta.x != 0 || panDelta.y != 0 || panDelta.z != 0 ||
        trackDelta.x != 0 || trackDelta.y != 0 || trackDelta.z != 0)
    {
        // calculate direction vectors after scene rotation matrix is applied
        var cameraUpRot = this.transformDirectionVector(cameraUp.x, cameraUp.y, cameraUp.z, sceneRot);
        var cameraRightRot = this.transformDirectionVector(cameraRight.x, cameraRight.y, cameraRight.z, sceneRot);    
        var cameraForwardRot = this.transformDirectionVector(cameraForward.x, cameraForward.y, cameraForward.z, sceneRot);    
            
        var scenePan = new Matrix4x4();
        scenePan.loadTranslation(
            cameraRightRot.x * panDelta.x + cameraUpRot.x * -panDelta.y + cameraForwardRot.x * -panDelta.z, 
            cameraRightRot.y * panDelta.x + cameraUpRot.y * -panDelta.y + cameraForwardRot.y * -panDelta.z, 
            cameraRightRot.z * panDelta.x + cameraUpRot.z * -panDelta.y + cameraForwardRot.z * -panDelta.z);
            
        sceneTrans = sceneTrans.multiply(scenePan);
        
        // formulate "track" or "dolly" vectors:
        // track forward = cameraForwardRot (calculated above) rotated about cameraRightRot 
        // (calculated above) viewRotation.x (camera pitch) degrees;
        // track up = track forward rotated about the camera right vector 90 degrees;
        // track right = cameraRightRot (calculated above)
        var sceneTrack = new Matrix4x4();
        var cameraVectorRot = new Matrix4x4();
        
        var flipIt = false;
        var abs_heading = Math.abs(viewRotation.y);
        var abs_pitch = Math.abs(viewRotation.x);
        var abs_bank = Math.abs(viewRotation.z);
        if (viewRotation.z >= 90 && viewRotation.z <= 270)
        {
            flipIt = true;
        }
        else if (viewRotation.z <= -90 && viewRotation.z >= -270)
        {
            flipIt = true
        }
        else
        {
            if (viewRotation.x <= -45 || (viewRotation.x >= 45 && viewRotation.x <= 90))
            {
                flipIt = true;
            }
        }
        
        var lastCameraForwardRot = cameraForwardRot;

        cameraVectorRot.loadRotation(cameraRightRot.x, cameraRightRot.y, cameraRightRot.z, viewRotation.x);
        cameraForwardRot = this.transformDirectionVector(cameraForwardRot.x, cameraForwardRot.y, cameraForwardRot.z, cameraVectorRot);

        var angle = toDegrees(Math.acos(cosineAngleBetween(lastCameraForwardRot, cameraForwardRot)));

        cameraVectorRot.loadRotation(cameraRightRot.x, cameraRightRot.y, cameraRightRot.z, 90);
        cameraUpRot = this.transformDirectionVector(cameraUpRot.x, cameraUpRot.y, cameraUpRot.z, cameraVectorRot);
        sceneTrack.loadTranslation(
            cameraRightRot.x * trackDelta.x + cameraUpRot.x * -trackDelta.y + cameraForwardRot.x * -trackDelta.z, 
            cameraRightRot.y * trackDelta.x + cameraUpRot.y * -trackDelta.y + 0, /*cameraForwardRot.y * -trackDelta.z,*/ // don't set y-component when z-tracking
            cameraRightRot.z * trackDelta.x + cameraUpRot.z * -trackDelta.y + cameraForwardRot.z * -trackDelta.z);

        sceneTrans = sceneTrans.multiply(sceneTrack);
    }
    
    // set pivot distance transforms

    // get camera position in world coordinates
    var viewTransformWorld = new Matrix4x4();
    viewTransformWorld.loadMatrix(viewTransform);
    viewTransformWorld.invert();
    var cameraPos = new Vector3D();
    cameraPos.load(viewTransformWorld._41, viewTransformWorld._42, viewTransformWorld._43);

    var pivotTrans = new Vector3D();
    pivotTrans.load(
        cameraPos.x + cameraForward.x * pivotDistance,
        cameraPos.y + cameraForward.y * pivotDistance,
        cameraPos.z + cameraForward.z * pivotDistance);                
	this.pivotPointWorld.setValueDirect(pivotTrans.x, pivotTrans.y, pivotTrans.z);

    var scenePivot = new Matrix4x4();
    var scenePivotInv = new Matrix4x4();
    scenePivot.loadTranslation(-pivotTrans.x, -pivotTrans.y, -pivotTrans.z);
    scenePivotInv.loadTranslation(pivotTrans.x, pivotTrans.y, pivotTrans.z);
    
    // set overall transform
    var resultTransform = sceneTrans.multiply(scenePivot.multiply(sceneRot.multiply(scenePivotInv.multiply(viewTransform))));

    var resultRotation = resultTransform.getRotationAngles();

    var resultPosition = new Vector3D();
    resultPosition.load(resultTransform._41, resultTransform._42, resultTransform._43);
    resultTransform.transpose(); // invert rotation
    resultPosition = resultTransform.transform(resultPosition.x, resultPosition.y, resultPosition.z, 0);

    // output results
    this.resultPosition.setValueDirect(-resultPosition.x, -resultPosition.y, -resultPosition.z);
    this.resultRotation.setValueDirect(-resultRotation.x, -resultRotation.y, -resultRotation.z);
}

SceneInspector.prototype.transformDirectionVector = function(x, y, z, matrix)
{
    var m = new Matrix4x4();
    m.loadMatrix(matrix);
    m.transpose(); // invert rotation
    
    return m.transform(x, y, z, 0);
}

/*
SceneInspector.prototype.zoomIn = function()
{
   var x = bridgeworks.registry.find("SceneInspector");
   x.panDelta.z+=30;
    x.panDelta.setValueDirect(this.panDelta.x, this.panDelta.y, this.panDelta.z, this.viewTransform);
    x.updateScene();
}

SceneInspector.prototype.zoomOut = function()
{
    this.panDelta.z-=30;
    this.panDelta.setValueDirect(this.panDelta.x, this.panDelta.y, this.panDelta.z,this.viewTransform);
    this.updateScene();
}
*/


ArcballInspector.prototype = new Evaluator();
ArcballInspector.prototype.constructor = ArcballInspector;

function ArcballInspector()
{
    Evaluator.call(this);
    this.className = "ArcballInspector";
    this.attrType = eAttrType.ArcballInspector;

    this.sphereCenter = new Vector3DAttr(0, 0, 0);
    this.sphereRadius = new NumberAttr(0);
    this.mouseDown = new Vector2DAttr(0, 0);
    this.mouseNow = new Vector2DAttr(0, 0);
    this.quatAtMouseDown = new QuaternionAttr(1, 0, 0, 0);
    this.viewport = new ViewportAttr(0, 0, 0, 0);
    this.worldTransform = new Matrix4x4Attr();
    this.viewTransform = new Matrix4x4Attr();
    this.constrainToAxis = new BooleanAttr(false);
    this.constraintAxis = new Vector3DAttr(0, 0, 0);
    this.resultQuat = new QuaternionAttr(1, 0, 0, 0);

    this.registerAttribute(this.sphereCenter, "sphereCenter");
    this.registerAttribute(this.sphereRadius, "sphereRadius");
    this.registerAttribute(this.mouseDown, "mouseDown");
    this.registerAttribute(this.mouseNow, "mouseNow");
    this.registerAttribute(this.quatAtMouseDown, "quatAtMouseDown");
    this.registerAttribute(this.viewport, "viewport");
    this.registerAttribute(this.worldTransform, "worldTransform");
    this.registerAttribute(this.viewTransform, "viewTransform");
    this.registerAttribute(this.constrainToAxis, "constrainToAxis");
    this.registerAttribute(this.constraintAxis, "constraintAxis");
    this.registerAttribute(this.resultQuat, "resultQuat");
}

ArcballInspector.prototype.evaluate = function()
{
    if (!(this.enabled.getValueDirect()))
    {
        return;
    }

    // get input values

    // sphere center
    var center = this.sphereCenter.getValueDirect();

    // sphere radius
    var radius = this.sphereRadius.getValueDirect();

    // mouse coords
    var mouseDown = this.mouseDown.getValueDirect();
    var mouseNow = this.mouseNow.getValueDirect();

    // mouse down quat
    var quatDown = this.quatAtMouseDown.getValueDirect();

    // viewport
    var vp = this.viewport;
 
    // world transform
    var world = this.worldTransform.getValueDirect();

    // view transform
    var view = this.viewTransform.getValueDirect();

    // invert world transform (to account for existing transformations) and combine with view transform
    world.invert();
    view = view.multiply(world);

    // constrain to axis
    var constrain = this.constrainToAxis.getValueDirect();

    // normalize screen coordinates to [-1, 1] (invert y -- screen y coords are reversed)
    center.x    = 2 * (center.x - vp.x) / vp.width -1;
    center.y    = 2 * (vp.height - center.y - vp.y) / vp.height - 1;
    mouseDown.x = 2 * (mouseDown.x - vp.x) / vp.width  - 1;
    mouseDown.y = 2 * (vp.height - mouseDown.y - vp.y) / vp.height - 1;
    mouseNow.x  = 2 * (mouseNow.x  - vp.x) / vp.width  - 1;
    mouseNow.y  = 2 * (vp.height - mouseNow.y  - vp.y) / vp.height - 1;
    
    // get points on sphere corresponding to mouse down and mouse now
    var ptDown, ptNow;
    if (!constrain)
    {
        ptDown = this.getSpherePoint(mouseDown, center, radius);
        ptNow = this.getSpherePoint(mouseNow, center, radius);
    }
    else // constrain
    {
        // constraint axis
        var axis = this.constraintAxis.getValueDirect();

        ptDown = this.getSpherePointAboutAxis(mouseDown, center, radius, axis);
        ptNow = this.getSpherePointAboutAxis(mouseNow, center, radius, axis);
    }

    // transform by view matrix
    var ptDownX = view.transform(ptDown.x, ptDown.y, ptDown.z, 0);
    var ptNowX = view.transform(ptNow.x, ptNow.y, ptNow.z, 0);
    ptDown.x = ptDownX.x;
    ptDown.y = ptDownX.y;
    ptDown.z = ptDownX.z;
    ptNow.x = ptNowX.x;
    ptNow.y = ptNowX.y;
    ptNow.z = ptNowX.z;
    ptDown.normalize();
    ptNow.normalize();

    // construct unit quaternion from the two points on sphere
    var quatDrag = this.getQuatFromSpherePoints(ptDown, ptNow);

    // multiply drag quaternion with down quaternion
    quatDrag = quatDrag.multiply(quatDown);
    
    this.resultQuat.setValueDirect(quatDrag);
}

ArcballInspector.prototype.getSpherePoint = function(mouse, center, radius)
{
    var point = new Vector3D();
    
    point.x = (mouse.x - center.x) / radius;
    point.y = (mouse.y - center.y) / radius;

    var mag = point.x * point.x + point.y * point.y;
    if (mag > 1.0)
    {
        var scale = 1 / Math.sqrt(mag);
        point.x *= scale;
        point.y *= scale;
        point.z = 0;
    }
    else // mag <= 1.0f
    {
        point.z = -(Math.sqrt(1 - mag));
    }
    return point;
}

ArcballInspector.prototype.getSpherePointAboutAxis = function(mouse, center, radius, axis)
{
    point = this.getSpherePoint(mouse, center, radius);

    var dot = dotProduct(point, axis);
    
    axis.multiplyScalar(dot);
    
    var proj = new Vector3D(point.x, point.y, point.z);
    
    proj.subtractVector(axis);
    
    var norm = magnitude(proj.x, proj.y, proj.z);
    
    point = null;
    
    if (norm > 0)
    {
        var s = 1 / Math.sqrt(norm);
        if (proj.z < 0)
        {
            proj.x = -proj.x;
            proj.y = -proj.y;
            proj.z = -proj.z;
        }

        point = proj.multiplyScalar(s);
    }
    else if (axis.z == 1.0)
    {
        point = new Vector3D(1, 0, 0);
    }
    else
    {
        point.normalize();
    }
}

ArcballInspector.prototype.getQuatFromSpherePoints = function(pt1, pt2)
{
    var quat = new Quaternion();
    quat.x = pt1.y * pt2.z - pt1.z * pt2.y;
    quat.y = pt1.z * pt2.x - pt1.x * pt2.z;
    quat.z = pt1.x * pt2.y - pt1.y * pt2.x;
    quat.w = pt1.x * pt2.x + pt1.y * pt2.y + pt1.z * pt2.z;
    return quat;
}

// doesn't do anything
function ArcballInspector_ViewTransformModifiedCB(attribute, container)
{
    /*
    if (attr)
    {
        CMatrix4x4FloatAttr* viewTransform = dynamic_cast<CMatrix4x4FloatAttr*>(attr);
        if (viewTransform)
        {
            CMatrix4x4f m;
            viewTransform.getValueDirect(m);
        }
    }
    */
}


KeyframeInterpolator.prototype = new Evaluator();
KeyframeInterpolator.prototype.constructor = KeyframeInterpolator;

function EndState()
 {
    this.initialized = false;
    this.startKeyIts = []; // one for each channel
    this.endKeyIts = [];  // one for each channel
    this.startTime = -FLT_MAX;    // across all channels
    this.endTime = FLT_MAX;     // across all channels
 }
    
function KeyframeInterpolator()
{
    Evaluator.call(this);
    this.className = "KeyframeInterpolator";
    this.attrType = eAttrType.KeyframeInterpolator;

    this.lastTime = 0;
    this.evaluated = false;
    this.endState =  new EndState();
    
    this.time = new NumberAttr(0);
    this.channels = new AttributeVector();
    this.startKeys = new AttributeVector();
    this.endKeys = new AttributeVector();
    this.preBehaviors = new AttributeVector();
    this.postBehaviors = new AttributeVector();
    this.resultValues = new AttributeVector();

    this.time.addModifiedCB(KeyframeInterpolator_TimeModifiedCB, this);
    
    this.registerAttribute(this.time, "time");
    this.registerAttribute(this.channels, "channels");
    this.registerAttribute(this.startKeys, "startKeys");
    this.registerAttribute(this.endKeys, "endKeys");
    this.registerAttribute(this.preBehaviors, "preBehaviors");
    this.registerAttribute(this.postBehaviors, "postBehaviors");
    this.registerAttribute(this.resultValues, "resultValues");
}

KeyframeInterpolator.prototype.setNumChannels = function(numChannels)
{
    // clear
    this.channels.resize(0);
    this.startKeys.resize(0);
    this.endKeys.resize(0);
    this.preBehaviors.resize(0);
    this.postBehaviors.resize(0);
    this.resultValues.resize(0);
    
    for (var i=0; i < numChannels; i++)
    {
        this.channels.push_back(new KeyframesAttr());
        this.startKeys.push_back(new NumberAttr(-1));
        this.endKeys.push_back(new NumberAttr(-1));
        this.preBehaviors.push_back(new NumberAttr(eEndBehavior.Reset));
        this.postBehaviors.push_back(new NumberAttr(eEndBehavior.Reset));
        this.resultValues.push_back(new NumberAttr(0));
    }
}

KeyframeInterpolator.prototype.evaluate = function()
{
    // initialize end state if not already initialized
    if (!this.endState.initialized)
    {
        // initialize
        this.updateEndState();
        this.endState.initialized = true;
    }
    
    // get input values

    // time
    var time = this.time.getValueDirect();

    var first, last;
    var pre, post;

    // for each channel...
    for (var i = 0; i < this.channels.vector.length; i++)
    {
        var keyframes = this.channels.getAt(i);
        if (keyframes.vector.length == 0) continue;

        first = this.endState.startKeyIts[i];
        last = this.endState.endKeyIts[i];

        pre = this.preBehaviors.getAt(i).getValueDirect();
        post = this.postBehaviors.getAt(i).getValueDirect();

        // interpolate
        var value = interpolate(time, keyframes, first, last, pre, post);

        // output result
        this.resultValues.getAt(i).setValueDirect(value);
    }

    this.lastTime = time;
    this.evaluated = true;
}

KeyframeInterpolator.prototype.timeModified = function()
{
    this.updateExpired();
}

KeyframeInterpolator.prototype.updateExpired = function()
{
    // determine if kfi has "expired"
    this.expired.setValueDirect(false);

    // NOTE: this code moved from RenderAgent

    // an multi-channel Evaluator (i.e., KeyframeInterpolator) is considered
    // animating if any 1 of its channels meet the requirements for determining
    // whether or not Evaluate is called.  For KeyframeInterpolators, "at least
    // one channel is animating" if any one of the channels' keys has a time 
    // value greater than the current time.
    var bAtLeastOneChannelAnimating = false;

    // for each channel in the interpolator, compare current time
    // with both end behavior and stop time to determine whether or 
    // not this kfi should continue to be evaluated
    var fEvalTime = this.time.getValueDirect();
    var iPost = 0;
    var postBehavior = null;
    var numChannels = this.channels.vector.length;
    for (var i=0; i < numChannels; i++)
    {
        postBehavior = this.postBehaviors.getAt(i);
        if (postBehavior)
        {
            iPost = postBehavior.getValueDirect();
        }

        // if *expression* is TRUE then the end behavior is 
        // repeat, oscillate, or some other continuous behavior
        if (iPost != eEndBehavior.Constant)
        {
            bAtLeastOneChannelAnimating = true;
            break;
        }
    }

    // if the eval's current time either:
    // 1. has advanced passed its longest keyframe OR
    // 2. is not yet at its start time
    // then stop evaluating it.
    // NOTE: only check Constant end behaviors b/c Repeats and
    // Oscillators should keep running.  By definition, scenes w/
    // non-constant end behaviors will never AA
    if (!bAtLeastOneChannelAnimating &&
        (fEvalTime < this.endState.startTime || fEvalTime > this.endState.endTime))
    {
        // set expired flag
        this.expired.setValueDirect(true);
    }
}

KeyframeInterpolator.prototype.updateEndState = function()
{
    var fStartTime = -1;
    var fEndTime = -1;
    var fShortest = FLT_MAX;
    var fLongest = -FLT_MAX;
    var startKey = -1, endKey = -1;
    var keyframes = null;
    var numChannels = this.channels.vector.length;
    
    this.startKeys.resize(numChannels);
    this.endKeys.resize(numChannels);
    
    for (var i=0; i < numChannels; i++)
    {
        keyframes = this.channels.getAt(i);
        
        startKey = this.startKeys.vector.length > i ? this.startKeys.getAt(i).getValueDirect() : -1;
        endKey = this.endKeys.vector.length > i ? this.endKeys.getAt(i).getValueDirect() : -1;
        
        if (endKey < startKey)
        {
            endKey = startKey;
        }
        
        // set first/last keys to evaluate
        this.endState.startKeyIts[i] = keyframes.getAt(0);
        this.endState.endKeyIts[i] = keyframes.getAt(keyframes.vector.length - 1);

        if (startKey >= 0 && startKey < keyframes.vector.length)
        {
            this.endState.startKeyIts[i] = keyframes.getAt(startKey);
        }

        if (endKey >= 0 && endKey < keyframes.vector.length)
        {
            this.endState.endKeyIts[i] = keyframes.getAt(endKey);
        }

	fStartTime = this.endState.startKeyIts[i].getTime();
        fEndTime = this.endState.endKeyIts[i].getTime();

	// save the smallest start time for all channels
	fShortest = fStartTime < fShortest ? fStartTime : fShortest;

	// save the longest end time for all channels
	fLongest = fEndTime >= fLongest ? fEndTime : fLongest;
    }
    
    this.endState.startTime = fShortest;
    this.endState.endTime = fLongest;
}

function KeyframeInterpolator_TimeModifiedCB(attribute, container)
{
    container.timeModified();
}

function KeyframeInterpolator_EndStateModifiedCB(attribute, container)
{
    container.updateEndState();
}
BBoxLocator.prototype = new Evaluator();
BBoxLocator.prototype.constructor = BBoxLocator;

function BBoxLocator()
{
    Evaluator.call(this);
    this.className = "BBoxLocator";
    this.attrType = eAttrType.BBoxLocator;

    this.viewPosition = new Vector3DAttr(0, 0, 0);
    this.viewTransform = new Matrix4x4Attr(1, 0, 0, 0,
                                           0, 1, 0, 0,
                                           0, 0, 1, 0,
                                           0, 0, 0, 1);
    this.viewVolume = new ViewVolumeAttr();
    this.viewport = new ViewportAttr(0, 0, 0, 0);
    this.nearDistance = new NumberAttr(0);
    this.bbox = new BBoxAttr();
    this.bboxView = new BBoxAttr();
    this.closeness = new NumberAttr(0.5);
    this.resultPosition = new Vector3DAttr(0, 0, 0);
    this.resultWidth = new NumberAttr(0);
    this.resultFarDistance = new NumberAttr(0);
    this.resultPivotDistance = new NumberAttr(0);
    
    this.registerAttribute(this.viewPosition, "viewPosition");
    this.registerAttribute(this.viewTransform, "viewTransform");
    this.registerAttribute(this.viewVolume, "viewVolume");
    this.registerAttribute(this.viewport, "viewport");
    this.registerAttribute(this.nearDistance, "nearDistance");
    this.registerAttribute(this.bbox, "bbox");
    this.registerAttribute(this.bboxView, "bboxView");
    this.registerAttribute(this.closeness, "closeness");
    this.registerAttribute(this.resultPosition, "resultPosition");
    this.registerAttribute(this.resultWidth, "resultWidth");
    this.registerAttribute(this.resultFarDistance, "resultFarDistance");
    this.registerAttribute(this.resultPivotDistance, "resultPivotDistance");
}

BBoxLocator.prototype.evaluate = function()
{
    // get input values

    // position
    var viewPosition = this.viewPosition.getValueDirect();

    // view transform
    var viewTransform = this.viewTransform.getValueDirect();

    // view volume planes
    var left = this.viewVolume.left.getValueDirect();
    var right = this.viewVolume.right.getValueDirect();
    var top = this.viewVolume.top.getValueDirect();
    var bottom = this.viewVolume.bottom.getValueDirect();
    var near = this.viewVolume.near.getValueDirect();
    var far = this.viewVolume.far.getValueDirect();

    // viewport
    var viewport = this.viewport.getValueDirect();

    // bbox min/max points
    var min = this.bbox.min.getValueDirect();
    var max = this.bbox.max.getValueDirect();

    // closeness
    var closeness = this.closeness.getValueDirect();
    if (closeness != 0)
    {
        var bbw = max.x - min.x;
        var bbh = max.y - min.y;

        bbw += bbw * closeness;
        bbh += bbh * closeness;

        if (viewport.width / viewport.height < bbw / bbh)
        {
            bbw = (bbw - (max.x - min.x)) / 2;
            min.x -= bbw;
            max.x += bbw;
        }
        else // (viewport.width / viewport.height >= bbw / bbh)
        {
            bbh = (bbh - (max.y - min.y)) / 2;
            min.y -= bbh;
            max.y += bbh;
        }
    }

    // formulate bbox endpoints
    var p = new Array(8);
    p[0] = new Vector3D(min.x, min.y, min.z);
    p[1] = new Vector3D(min.x, min.y, max.z);
    p[2] = new Vector3D(min.x, max.y, min.z);
    p[3] = new Vector3D(min.x, max.y, max.z);
    p[4] = new Vector3D(max.x, min.y, min.z);
    p[5] = new Vector3D(max.x, min.y, max.z);
    p[6] = new Vector3D(max.x, max.y, min.z);
    p[7] = new Vector3D(max.x, max.y, max.z);

    // get center of world-space bbox
    var center = new Vector3D((min.x + max.x) / 2,
                              (min.y + max.y) / 2,
                              (min.z + max.z) / 2);

    // get camera forward vector
    var fwd = new Vector3D();
    fwd.copy(viewTransform.transform(0, 0, 1, 0));
    fwd.normalize();

    var distance = 0;
    var resultPosition;
    var perspectiveViewVolume = planesIntersect(left, right);

    // if perspective camera...
    if (perspectiveViewVolume)
    {
        // formulate camera-oriented view-volume planes centered at bbox center
        var vvPlanes = new Array(5); // don't consider far plane

        vvPlanes[0] = this.getPlane(left.point, center, left.normal, viewTransform);
        vvPlanes[1] = this.getPlane(right.point, center, right.normal, viewTransform);
        vvPlanes[2] = this.getPlane(top.point, center, top.normal, viewTransform);
        vvPlanes[3] = this.getPlane(bottom.point, center, bottom.normal, viewTransform);
        vvPlanes[4] = this.getPlane(near.point, center, near.normal, viewTransform);

        // for each bbox point, determine the maximum distance necessary to move all points to within the
        // view-volume along the camera forward vector		
        for (var i = 0; i < 8; i++)
        {
            for (var j = 0; j < 5; j++)
            {
                if (pointOnPositiveSideOfPlane(p[i], vvPlanes[j]))
                {
                    var d = this.distanceFromPlane(p[i], fwd, vvPlanes[j]);
                    if (d.intersection)
                    {
                        distance = Math.max(distance, d.distance);
                    }
                }
            }
        }

        resultPosition = new Vector3D(center.x, center.y, center.z);
        fwd.multiplyScalar(distance);
        resultPosition.subtractVector(fwd);
    }
    else // orthographic camera
    {
        resultPosition = new Vector3D(center.x, center.y, center.z);
        distance = magnitude(viewPosition.x, viewPosition.y, viewPosition.z);
        fwd.multiplyScalar(distance);
        resultPosition.subtractVector(fwd);

        // set width

        // get bboxView min/max points
        var vmin = this.bboxView.min.getValueDirect();
        var vmax = this.bboxView.max.getValueDirect();

        var width = distanceBetweenPlanes(right, left);
        var height = distanceBetweenPlanes(top, bottom);
        var aspect = width / height;

        var xDim = Math.abs(vmax.x - vmin.x);
        var yDim = Math.abs(vmax.y - vmin.y);

        // this could probably be simplified, but it works
        if (xDim > yDim)
        {
            width = xDim;

            height = width / aspect;
            if (height < yDim)
            {
                height = yDim;
                width = height * aspect;
            }
        }
        else
        {
            height = yDim;
            width = height * aspect;

            if (width < xDim)
            {
                width = xDim;
            }
        }

        // output result
        this.resultWidth.setValueDirect(width);
    }

    // output result(s)
    this.resultPosition.setValueDirect(resultPosition.x, resultPosition.y, resultPosition.z);

    // determine distance of all points from near clipping plane
    distance = 0;
    for (var i = 0; i < 8; i++)
    {
        var px = viewTransform.transform(p[i].x, p[i].y, p[i].z, 1);
        distance = Math.max(distance, distanceBetween(p[i], resultPosition));
    }

    this.resultFarDistance.setValueDirect(this.nearDistance.getValueDirect() + distance);

    // determine pivot distance (distance between camera and center of bbox in world-space)
    distance = distanceBetween(resultPosition, new Vector3D(center.x, center.y, center.z));
    this.resultPivotDistance.setValueDirect(distance);
}

BBoxLocator.prototype.getPlane = function(point, offset, normal, transform)
{
    var xpoint = transform.transformVector3D(point, 0);
    xpoint.x += offset.x;
    xpoint.y += offset.y;
    xpoint.z += offset.z;

    var xnormal = transform.transformVector3D(normal, 0);

    var plane = new Plane(new Vector3D(xpoint.x, xpoint.y, xpoint.z), new Vector3D(xnormal.x, xnormal.y, xnormal.z));

    return plane;
}

BBoxLocator.prototype.distanceFromPlane = function(point, dir, plane)
{
    var line = new Line(point, dir);
    var distance;

    var intersection = lineIntersectsPlane(line, plane);
    switch (intersection.result)
    {
    case 0: // no intersection
        distance = FLT_MAX;
        break;

    case 1: // intersection at 1 point
        distance = distanceBetween(point, intersection.point);
        break;

    case 2: // intersection at infinite points (line on plane) 
    default:
        distance = 0;
        break;
    }

    return { intersection: intersection.result, distance: distance };
}
function worldUnitsPerPixelPersp(viewport, zoom, viewSpace_Z)
{
    // get vertical field of view in radians
    var fovY = 2 * Math.atan2(1, zoom);

    // get horizontal field of view in radians
    var fovX = 2 * Math.atan(viewport.width / viewport.height * Math.tan(fovY / 2));

    // determine the width of the visible portion of the x axis on the 
    // clipping plane at viewSpace_Z
    var clipPlaneWidth  = Math.tan(fovX / 2) * viewSpace_Z * 2;

    // determine the height of the visible portion of the y axis on the
    // clipping plane at viewSpace_Z
    var clipPlaneHeight  = Math.tan(fovY / 2) * viewSpace_Z * 2;

    // determine the per-pixel clipPlaneWidth and clipPlaneHeight
    var x = clipPlaneWidth  / viewport.width;
    var y = clipPlaneHeight / viewport.height;
    
    return { x: x, y: y };
}

function worldUnitsPerPixelOrtho(viewport, width)
{
    // calculate height
    var height = width * (viewport.height / viewport.width);

    // determine the per-pixel width and height
    var x = width  / viewport.width;
    var y = height / viewport.height;
    
    return { x: x, y: y };
}

function toScreenSpace(world, view, proj, viewport)
{
    // transform to view space
    var screen = view.transformw(world.x, world.y, world.z, 1);

    // transform to projection space
	screen = proj.transformw(screen.x, screen.y, screen.z, screen.w);

    if (screen.w == 0)
    {
        return { x: -Infinity, y: -Infinity, z: -Infinity };
    }

    // normalize to [-1, 1]
    // (if x or y is outside the range (-w, w), the screen coordinate(s) will be 
    // outside the viewport
    screen.x /= screen.w;
    screen.y /= screen.w;
    //screen.z /= screen.w;

    // clip to viewport
    screen.x = viewport.x + viewport.width  - ((-screen.x + 1) * viewport.width  / 2);
    screen.y = viewport.y + viewport.height - (( screen.y + 1) * viewport.height / 2);
	screen.z = 0;
	
	return { x: screen.x, y: screen.y, z: screen.z };    
} 
RasterComponent.prototype = new ParentableMotionElement();
RasterComponent.prototype.constructor = RasterComponent;

function RasterComponent()
{
    ParentableMotionElement.call(this);
    this.className = "RasterComponent";
    this.attrType = eAttrType.RasterComponent;
    
    this.rcEventListener = null;
    
    this.opacity = new NumberAttr(1);				// opaque
	this.anchor = new Vector2DAttr(0, 0);			// 0, 0
	this.origin = new StringAttr("bottomLeft");		// bottom-left
	this.show = new BooleanAttr(true);				// true
	this.selectable = new BooleanAttr(true);		// true
	this.cullable = new BooleanAttr(true);			// true
	this.clampToViewport = new BooleanAttr(false);	// false
	this.rasterPosition = new Vector3DAttr();
	this.inspectionOffset = new Vector3DAttr();
	this.componentRect = new RectAttr();
	this.screenRect = new RectAttr();

	this.stylesMap.size.addModifiedCB(RasterComponent_StylesMapSizeModifiedCB, this);
	this.show.addModifiedCB(RasterComponent_ShowModifiedCB, this);
	
	this.registerAttribute(this.opacity, "opacity");
	this.registerAttribute(this.anchor, "anchor");
	this.registerAttribute(this.origin, "origin");
	this.registerAttribute(this.show, "show");
	this.registerAttribute(this.selectable, "selectable");
	this.registerAttribute(this.cullable, "cullable");
	this.registerAttribute(this.rasterPosition, "rasterPosition");
	this.registerAttribute(this.inspectionOffset, "inspectionOffset");
	this.registerAttribute(this.clampToViewport, "clampToViewport");
	this.registerAttribute(this.componentRect, "componentRect");
	this.registerAttribute(this.screenRect, "screenRect");

	this.renderSequenceSlot.setValueDirect(0xffff);
}

RasterComponent.prototype.setRegistry = function(registry)
{
    var bworks = registry.find("Bridgeworks");
    if (bworks)
    {
        this.rcEventListener = bworks.rasterComponentEventListener;
        if (this.rcEventListener)
        {
            this.rcEventListener.registerComponent(this); // TODO: unable to unregister without dtor
            this.rcEventListener.Listen(this);
        }
    }

    ParentableMotionElement.prototype.setRegistry.call(this, registry);
}

RasterComponent.prototype.isSelected = function(x, y)
{
    var show = this.show.getValueDirect();
    if (show)
    {
        if (this.screenRect.containsPoint(x, y))
        {
            return true;
        }
    }

    return false;
}

RasterComponent.prototype.stylesMapSizeModified = function()
{
    var size = this.stylesMap.Size();
    for (var i = 0; i < size; i++)
    {
        var styleMap = this.stylesMap.getAt(i);
        if (styleMap)
        {
            // add modified CBs for styles map elements' events (remove first to eliminate duplicates)
            styleMap.event.removeModifiedCB(RasterComponent_StylesMapElementEventModifiedCB, this);
            styleMap.event.addModifiedCB(RasterComponent_StylesMapElementEventModifiedCB, this);
            // invoke CB now for stylesMap that are set by reference
            RasterComponent_StylesMapElementEventModifiedCB(styleMap.event, this);
        }
    }
}

RasterComponent.prototype.stylesMapElementEventModified = function(eventName)
{
    this.rcEventListener.listenEvent(this, eEventNameMap[eventName]);
}

RasterComponent.prototype.showModified = function()
{
}

function RasterComponent_StylesMapSizeModifiedCB(attribute, container)
{
    container.stylesMapSizeModified();
}

function RasterComponent_StylesMapElementEventModifiedCB(attribute, container)
{
    container.stylesMapElementEventModified(attribute.getValueDirect().join(""));    
}

function RasterComponent_ShowModifiedCB(attribute, container)
{
    container.showModified();
}
Label.prototype = new RasterComponent();
Label.prototype.constructor = Label;

function Label()
{
    RasterComponent.call(this);
    this.className = "Label";
    this.attrType = eAttrType.Label;

    this.iconRect = new Rect(0, 0, 0, 0);
    this.labelRect = new Rect(0, 0, 0, 0);
    
    this.text = new StringAttr("");
    this.description = new StringAttr("");
    this.depthShadingEnabled = new BooleanAttr(true);
    this.labelStyle = new LabelStyleAttr();
    this.iconStyle = new IconStyleAttr();
    this.balloonTipLabelStyle = new BalloonTipLabelStyleAttr();
    
    this.text.addModifiedCB(Label_TextModifiedCB, this);
    this.description.addModifiedCB(Label_DescriptionModifiedCB, this);
    this.labelStyle.backgroundColor.addModifiedCB(Label_LabelStyleBackgroundColorModifiedCB, this);
    this.labelStyle.backgroundOpacity.addModifiedCB(Label_LabelStyleBackgroundOpacityModifiedCB, this);
    this.labelStyle.fontStyle.borderColor.addModifiedCB(Label_LabelStyleFontBorderModifiedCB, this);
    this.labelStyle.fontStyle.borderWidth.addModifiedCB(Label_LabelStyleFontBorderModifiedCB, this);    
    this.labelStyle.fontStyle.color.addModifiedCB(Label_LabelStyleFontStyleColorModifiedCB, this);
    this.labelStyle.fontStyle.font.addModifiedCB(Label_LabelStyleFontStyleFontModifiedCB, this);
    this.labelStyle.fontStyle.opacity.addModifiedCB(Label_LabelStyleFontStyleOpacityModifiedCB, this);
    this.labelStyle.fontStyle.size.addModifiedCB(Label_LabelStyleFontStyleSizeModifiedCB, this);
    this.labelStyle.fontStyle.style.addModifiedCB(Label_LabelStyleFontStyleStyleModifiedCB, this);
    this.labelStyle.format.addModifiedCB(Label_LabelStyleFormatModifiedCB, this);
    this.labelStyle.padding.addModifiedCB(Label_LabelStylePaddingModifiedCB, this);
    this.iconStyle.url.addModifiedCB(Label_IconStyleUrlModifiedCB, this);
    this.balloonTipLabelStyle.addModifiedCB(Label_BalloonTipLabelStyleModifiedCB, this);
    
    this.registerAttribute(this.text, "text");
    this.registerAttribute(this.description, "description");
    this.registerAttribute(this.depthShadingEnabled, "depthShadingEnabled");
    this.registerAttribute(this.labelStyle, "labelStyle");
    this.registerAttribute(this.iconStyle, "iconStyle");
    this.registerAttribute(this.balloonTipLabelStyle, "balloonTipLabelStyle");
    
    this.styles.registerStyle(this.iconStyle, "iconStyle");
	this.styles.registerStyle(this.labelStyle, "labelStyle");
	this.styles.registerStyle(this.balloonTipLabelStyle, "balloonTipLabelStyle");
}

Label.prototype.setGraphMgr = function(graphMgr)
{
    // call base-class implementation
    RasterComponent.prototype.setGraphMgr.call(this, graphMgr);
    
    // create id
    this.id = "Label" + this.graphMgr.getNextLabelIndex;
    this.labelId = this.id + "_label";
    this.iconId = this.id + "_icon";
    
    // create html div for canvas overlay
    var htmlLabel = CreateHTMLLabel(this.id, this.labelId, this.iconId);
    this.htmlLabel = htmlLabel.label;
    this.htmlIconImg = htmlLabel.iconImg;
    this.htmlIconDiv = htmlLabel.iconDiv;
    
    // initialize base dimensions of icon (used for scaling)
    this.htmlIconImg.baseWidth = 0;
    this.htmlIconImg.baseHeight = 0;
    
    // set initial style
    Label_LabelStyleBackgroundColorModifiedCB(this.labelStyle.backgroundColor, this);
    Label_LabelStyleBackgroundOpacityModifiedCB(this.labelStyle.backgroundOpacity, this);
    Label_LabelStyleFontBorderModifiedCB(null, this); // handles borderColor and borderWidth
    Label_LabelStyleFontStyleColorModifiedCB(this.labelStyle.fontStyle.color, this);
    Label_LabelStyleFontStyleFontModifiedCB(this.labelStyle.fontStyle.font, this);
    Label_LabelStyleFontStyleOpacityModifiedCB(this.labelStyle.fontStyle.opacity, this);
    Label_LabelStyleFontStyleSizeModifiedCB(this.labelStyle.fontStyle.size, this);
    Label_LabelStyleFontStyleStyleModifiedCB(this.labelStyle.fontStyle.style, this);
    Label_LabelStyleFormatModifiedCB(this.labelStyle.format, this);
    Label_LabelStylePaddingModifiedCB(this.labelStyle.padding, this);
    Label_IconStyleUrlModifiedCB(this.iconStyle.url, this);
}

Label.prototype.update = function(params, visitChildren)
{
    // update icon scale
    // (necessary because dimensions are not available until image is actually loaded)
    this.updateIconScale();
    
    // call base-class implementation
    RasterComponent.prototype.update.call(this, params, visitChildren);
}

Label.prototype.updateIconScale = function()
{
    var scale = this.iconStyle.scale.getValueDirect();
        
    // obtain original dimensions
    if (this.htmlIconImg.baseWidth == 0)
    {
        this.htmlIconImg.baseWidth = this.htmlIconImg.offsetWidth;
        this.htmlIconImg.baseHeight = this.htmlIconImg.offsetHeight;
    }
    
    // scale
    if (this.htmlIconImg.baseWidth)
    {
        this.htmlIconImg.width = this.htmlIconImg.baseWidth * scale.x;
        this.htmlIconImg.height = this.htmlIconImg.baseHeight * scale.y;
    }
}

Label.prototype.apply = function(directive, params, visitChildren)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        // call base-class implementation
        RasterComponent.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }
    
    switch (directive)
    {
    case "render":
        {
            this.draw(params.viewport);
        }
        break;
        
    case "rayPick":
        {
            if (this.selectable.getValueDirect() == true &&
                this.show.getValueDirect() == true)
            {
                if (this.isSelected(params.clickPoint.x, params.clickPoint.y))
                {
                    var intersectRecord = new RayIntersectRecord();
                    intersectRecord.distance = 0;
                    
                    params.currentNodePath.push(this);           
                    params.directive.addPickRecord(new RayPickRecord(params.currentNodePath, intersectRecord, params.camera));                   
                    params.currentNodePath.pop();
                }
            }    
        }
        break;
    }
    
    // call base-class implementation
    RasterComponent.prototype.apply.call(this, directive, params, visitChildren);
}

Label.prototype.draw = function(viewport)
{
    var bworks = this.registry.find("Bridgeworks");

    // show
    if (this.show.getValueDirect() == false)
    {
        this.htmlLabel.style.visibility = "hidden";
        this.htmlIconImg.style.visibility = "hidden";
        return;
    }

    this.htmlLabel.style.visibility = "visible";
    this.htmlIconImg.style.visibility = "visible";

    // update visibility with respect to color/opacity
    if (this.labelStyle.fontStyle.opacity.getValueDirect() == 0)
    {
        this.htmlLabel.style.visibility = "hidden";
    }
    var iconColor = this.iconStyle.color.getValueDirect();
    if (iconColor.a == 0 ||
        this.iconStyle.opacity.getValueDirect() == 0)
    {
        this.htmlIconImg.style.visibility = "hidden";
    }

    // determine the rendering positions
    var positions = this.getRenderingPositions();

    var labelWidth = this.htmlLabel.offsetWidth; // * this.htmlLabel.style.zoom;
    var labelHeight = this.htmlLabel.offsetHeight; // * this.htmlLabel.style.zoom;
    var iconWidth = this.htmlIconImg.offsetWidth;
    var iconHeight = this.htmlIconImg.offsetHeight;

    // determine if label is fully contained within viewport
    if (positions.labelX < 0 ||
	    positions.labelY < 0 ||
	    positions.labelX + labelWidth > bworks.canvas.width ||
	    positions.labelY + labelHeight > bworks.canvas.height)
    {
        this.htmlLabel.style.visibility = "hidden";
    }

    // determine if icon is fully contained within viewport
    if (positions.iconX < 0 ||
	    positions.iconY < 0 ||
	    positions.iconX + iconWidth > bworks.canvas.width ||
	    positions.iconY + iconHeight > bworks.canvas.height)
    {
        this.htmlIconImg.style.visibility = "hidden";
    }

    // update positions if visible
    if (this.htmlLabel.style.visibility == "visible")
    {
        this.htmlLabel.style.left = bworks.canvas.offsetLeft + positions.labelX;
        this.htmlLabel.style.top = bworks.canvas.offsetTop + positions.labelY;

        this.labelRect.load(bworks.canvas.offsetLeft + positions.labelX,
                            bworks.canvas.offsetTop + positions.labelY,
                            this.labelRect.left + labelWidth,
                            this.labelRect.top + labelHeight);
    }
    else
    {
        this.labelRect.load(0, 0, 0, 0);
    }
    if (this.htmlIconImg.style.visibility == "visible")
    {
        this.htmlIconDiv.style.left = bworks.canvas.offsetLeft + positions.iconX;
        this.htmlIconDiv.style.top = bworks.canvas.offsetTop + positions.iconY;

        this.iconRect.load(bworks.canvas.offsetLeft + positions.iconX,
                           bworks.canvas.offsetTop + positions.iconY,
                           this.iconRect.left + iconWidth,
                           this.iconRect.top + iconHeight);
    }
    else
    {
        this.iconRect.load(0, 0, 0, 0);
    }

    // update screen rect
    var screenRect = new Rect(0, 0, 0, 0);
    if (this.htmlLabel.style.visibility == "visible" &&
        this.htmlIconImg.style.visibility == "visible")
    {
        screenRect.left = Math.min(this.labelRect.left, this.iconRect.left);
        screenRect.top = Math.min(this.labelRect.top, this.iconRect.top);
        screenRect.right = Math.max(this.labelRect.right, this.iconRect.right);
        screenRect.bottom = Math.max(this.labelRect.bottom, this.iconRect.bottom);
    }
    else if (this.htmlLabel.style.visibility == "visible")
    {
        screenRect.loadRect(this.labelRect);
    }
    else if (this.htmlIconImg.style.visibility == "visible")
    {
        screenRect.loadRect(this.iconRect);
    }
    this.screenRect.setValueDirect(screenRect);
}

Label.prototype.getRenderingPositions = function()
{
    // initialize
    var labelX = 0;
    var labelY = 0;
    var iconX = 0;
    var iconY = 0;
    
    // get screen position
    var screen = this.screenPosition.getValueDirect();
    
    // get anchor position
    var anchor = this.anchor.getValueDirect();
    
    // get label offset
    var offset = this.labelStyle.offset.getValueDirect();
    
    if (this.htmlIconImg.offsetWidth > 0 && 
        this.htmlLabel.offsetWidth > 0) // icon and label present
    {	
        var labelWidth = this.htmlLabel.offsetWidth;// * this.htmlLabel.style.zoom;
        var labelHeight = this.htmlLabel.offsetHeight;// * this.htmlLabel.style.zoom;
        var iconWidth = this.htmlIconImg.offsetWidth;
        var iconHeight = this.htmlIconImg.offsetHeight;
        
        // measure from origin
        if (this.origin.getValueDirect().join("") == "bottomLeft")
        {
            anchor.y = iconHeight - anchor.y;
        }
        
        // 
        iconX  = screen.x - anchor.x;
		iconY  = screen.y - anchor.y;
		labelX = iconX + offset.x;
		labelY = iconY + offset.y;
        
		// adjust according to alignment
		switch (this.labelStyle.textAlign.getValueDirect().join(""))
        {
        case "topLeft":
			labelX -= labelWidth;
			labelY -= labelHeight / 2;
			break;
			
		case "middleLeft":
			labelX -= labelWidth;
			labelY += iconHeight / 2 - labelHeight / 2;
		    break;
		    
		case "bottomLeft":
			labelX -= labelWidth;
			labelY += iconHeight - labelHeight / 2;
			break;
			
		case "topCenter":
			labelX += iconWidth / 2 - labelWidth / 2;
			labelY -= labelHeight;
		    break;
		    
	    case "middleCenter":
			labelX += iconWidth / 2 - labelWidth / 2;
			labelY += iconHeight / 2 - labelHeight / 2;
			break;
			
		case "bottomCenter":
			labelX += iconWidth / 2 - labelWidth / 2;
			labelY += iconHeight;
		    break;
		    
		case "topRight":
			labelX += iconWidth;
			labelY -= labelHeight / 2;
		    break;
		    
		case "bottomRight":
			labelX += iconWidth;
			labelY += iconHeight - labelHeight / 2;
			break;
			
		case "middleRight": // default
		default:
			labelX += iconWidth;
			labelY += iconHeight / 2 - labelHeight / 2;
			break;
		}
    }
    else if (this.htmlLabel.offsetWidth > 0)
    {   
        var labelWidth = this.htmlLabel.offsetWidth;// * this.htmlLabel.style.zoom;
        var labelHeight = this.htmlLabel.offsetHeight;// * this.htmlLabel.style.zoom;
        
        // 
        labelX = screen.x + anchor.x + offset.x;
        labelY = screen.y - anchor.y + offset.y;
        
        // adjust according to alignment
        switch (this.labelStyle.textAlign.getValueDirect().join(""))
        {
        case "topLeft":
	        labelX -= labelWidth;
		    labelY -= labelHeight;
		    break;
    		
	    case "middleLeft":
	        labelX -= labelWidth;
		    labelY -= labelHeight / 2;	
		    break;
    		
	    case "bottomLeft":
		    labelX -= labelWidth;
	        break;
    	    
	    case "topCenter":
		    labelX -= labelWidth / 2;
		    labelY -= labelHeight;
		    break;
    		
	    case "middleCenter":
		    labelX -= labelWidth / 2;
		    labelY -= labelHeight / 2;
	        break;
    	    
	    case "bottomCenter":
		    labelX -= labelWidth / 2;
		    break;
    		
	    case "topRight":
		    labelY -= labelHeight;
		    break;
    			
	    case "bottomRight":
		    break;
    		
	    case "middleRight": // default
	    default:
		    labelY -= labelHeight / 2;
		    break;
        }
    }
    else // only icon present
    {
        var iconWidth = this.htmlIconImg.offsetWidth;
        var iconHeight = this.htmlIconImg.offsetHeight;
        
        // measure from bottom left
		anchor.y = iconHeight - anchor.y;

		iconX = screen.x - anchor.x;
		iconY = screen.y - anchor.y;
    }
    
    return { labelX: labelX, labelY: labelY, iconX: iconX, iconY: iconY };
}

Label.prototype.eventPerformed = function(event)
{
    if (!(this.show.getValueDirect()))
    {
        return false;
    }

    var selected = this.isSelected(event.x, event.y);

    return selected;
}

Label.prototype.labelStyleFontBorderModified = function()
{
    var color = this.labelStyle.fontStyle.borderColor.getValueDirect();
    color.a *= this.labelStyle.fontStyle.opacity.getValueDirect();
    var width = this.labelStyle.fontStyle.borderWidth.getValueDirect();
    
    var shadow = "";
    for (var i=0; i < color.a; i+=0.2)
    {
        if (i > 0) shadow += ", ";
        
        shadow += "rgba(" + color.r * 255 + "," 
                          + color.g * 255 + "," 
                          + color.b * 255 + "," 
                          + color.a + ")" + " 0px 0px " + width * 2 + "px";
    }
 
    this.htmlLabel.style.textShadow = shadow;
}

function CreateHTMLLabel(id, labelId, iconId)
{
    var newDiv = null;
    var newLabel = null;
    var newIconImg = null;
    var newIconDiv = null;

    // Needs further refactoring. Currently set in an app Helper
    // because we don't have container scope here to append these elements
    if (bridgeworks.rasterComponents)
    {
        // containing div
        newDiv = document.createElement("div");
        if (newDiv)
        {
            newDiv.setAttribute("id", id);

            // label
            newLabel = document.createElement("span");
            if (newLabel)
            {
                newLabel.setAttribute("id", labelId);
                newLabel.setAttribute("class", "labelText");
                newLabel.style.visibility = "hidden";
                newLabel.style.position = "absolute";
                newLabel.style.zIndex = 3;
                //newLabel.style.zoom = 1;//.95;
                newLabel.onmousedown = function() { /*onMouseDown();*/ };
                newLabel.onmouseup = function() { /*onMouseUp();*/ };
                newLabel.onmousemove = function() { /*onMouseMove();*/ };
                // disable selection
                newLabel.onselectstart = new Function("return false");

                newDiv.appendChild(newLabel);
            }

            // icon
            newIconDiv = document.createElement("div");
            if (newIconDiv)
            {
                newIconDiv.setAttribute("id", iconId);
                newIconDiv.style.position = "absolute";
                newIconDiv.style.zIndex = 3;

                newIconImg = document.createElement("img");
                if (newIconImg)
                {
                    newIconImg.setAttribute("class", "labelIcon");
                    newIconImg.style.visibility = "hidden";
                    newIconImg.src = "BwContent/images/1x1.png";
                    //newIconImg.onmousedown = function(){onMouseDown();};
                    newIconImg.onmouseup = function() { /*onMouseUp();*/ };
                    newIconImg.onmousemove = function() { /*onMouseMove();*/ };
                    // disable selection
                    newIconImg.onmousedown = function() { return false; };

                    newIconDiv.appendChild(newIconImg);
                }
                newDiv.appendChild(newIconDiv);
            }

            bridgeworks.rasterComponents.appendChild(newDiv);
        }
    }

    return { div: newDiv, label: newLabel, iconDiv: newIconDiv, iconImg: newIconImg };
}

function Label_TextModifiedCB(attribute, container)
{
    container.htmlLabel.innerHTML = attribute.getValueDirect().join("");
}

function Label_DescriptionModifiedCB(attribute, container)
{
    var description = attribute.getValueDirect().join("");
    if (description.length > 0)
    {
        // desired dimensions; if 0, use 50% canvas size
        var width = container.balloonTipLabelStyle.htmlLabelStyle.width.getValueDirect();
        var height = container.balloonTipLabelStyle.htmlLabelStyle.height.getValueDirect();
        if (width == 0 || height == 0)
        {
            var viewportMgr = container.registry.find("ViewportMgr");
            if (width == 0) width = viewportMgr.getAttribute("width").getValueDirect() * 0.5;
            if (height == 0) height = viewportMgr.getAttribute("height").getValueDirect() * 0.5;
        }
        
        var id = '#' + container.iconId;
        description = "<div class='gmap' style='" + 
                      "width:" + (width + 12) + "px;" + // (+ 12 accounts for close button)
                      "height:12px;'>" + 
                      "<a href='javascript:void($(\"" +
                      id + 
                      "\").btOff());'><img src='libs/jquery/bt/close.gif' alt='close' width='12' height='12' class='gmap-close' /></a> " + 
                      "</div>" +
                      "<div style='" +
                      "width:" + (width + 12) + "px;" + // (+ 12 accounts for close button)
                      "height:" + height + "px;" + 
                      "overflow:auto;'>" +
                      description +
                      "</div>";
            
        var bgColor = container.balloonTipLabelStyle.bgColor.getValueDirect();
        var fill = "rgba(" + bgColor.r * 255 + "," 
                           + bgColor.g * 255 + "," 
                           + bgColor.b * 255 + ","
                           + bgColor.a * 255 + ")"; 
                                                  
        $(id).bt(description, {trigger: 'click',
                               width: width + 12 + "px", // (+ 12 accounts for close button)
                               height: height + 12 + "px", // (+ 12 accounts for close button)
                               shrinkToFit: ((width == 0 && height == 0) ? true : false),
                               centerPointX: .9,
                               spikeLength: container.balloonTipLabelStyle.balloonOffset.getValueDirect(),
                               spikeGirth: 30,
                               padding: 15,
                               cornerRadius: 25,
                               fill: fill,
                               strokeStyle: '#ABABAB',
                               strokeWidth: 1,
                               shadow: true,
                               shadowOffsetX: 3,
                               shadowOffsetY: 3,
                               shadowBlur: 8,
                               shadowColor: 'rgba(0,0,0,.9)',
                               shadowOverlap: false,
                               noShadowOpts: {strokeStyle: '#999', strokeWidth: 2}});
    }
    else
    {
        var id = '#' + container.iconId;
        $(id).bt("", {trigger: 'click'});
    }
}

function Label_LabelStyleBackgroundColorModifiedCB(attribute, container)
{
    var color = attribute.getValueDirect();
    color.a *= attribute.getContainer().getAttribute("backgroundOpacity").getValueDirect();
    container.htmlLabel.style.backgroundColor = "rgba(" + color.r * 255 + "," 
                                                        + color.g * 255 + "," 
                                                        + color.b * 255 + ","
                                                        + color.a + ")";
}

function Label_LabelStyleBackgroundOpacityModifiedCB(attribute, container)
{
    Label_LabelStyleBackgroundColorModifiedCB(container.labelStyle.backgroundColor, container);
}

function Label_LabelStyleFontBorderModifiedCB(attribute, container)
{
    container.labelStyleFontBorderModified();
}

function Label_LabelStyleFontStyleColorModifiedCB(attribute, container)
{
    var color = attribute.getValueDirect();
    color.a *= attribute.getContainer().getAttribute("opacity").getValueDirect();
    container.htmlLabel.style.color = "rgba(" + color.r * 255 + "," 
                                              + color.g * 255 + "," 
                                              + color.b * 255 + ","
                                              + color.a + ")";
}

function Label_LabelStyleFontStyleFontModifiedCB(attribute, container)
{
    container.htmlLabel.style.fontFamily = attribute.getValueDirect().join("");
}

function Label_LabelStyleFontStyleOpacityModifiedCB(attribute, container)
{
    Label_LabelStyleFontStyleColorModifiedCB(container.labelStyle.fontStyle.color, container);
    Label_LabelStyleFontBorderModifiedCB(null, container);
}

function Label_LabelStyleFontStyleSizeModifiedCB(attribute, container)
{
    container.htmlLabel.style.fontSize = attribute.getValueDirect() + "pt";
}

function Label_LabelStyleFontStyleStyleModifiedCB(attribute, container)
{
    switch (attribute.getValueDirect().join(""))
    {
    case "Bold":
        container.htmlLabel.style.fontWeight = "bold";
        break;
        
    case "Heavy":
        container.htmlLabel.style.fontWeight = "bolder";  
        break;
        
    case "Normal":
        container.htmlLabel.style.fontWeight = "normal";
        break;
        
    case "Thin":
        container.htmlLabel.style.fontWeight = "lighter";
        break;
    }
}

function Label_LabelStyleFormatModifiedCB(attribute, container)
{
    var format = attribute.getValueDirect().join("");
    //container.htmlLabel.style.setProperty("textAlign", format, "normal");
    // TODO
}

function Label_LabelStylePaddingModifiedCB(attribute, container)
{
    var padding = attribute.getValueDirect() + "px";
    container.htmlLabel.style.paddingLeft = padding;
    container.htmlLabel.style.paddingRight = padding;
    container.htmlLabel.style.paddingTop = padding;
    container.htmlLabel.style.paddingBottom = padding;    
}

function Label_IconStyleUrlModifiedCB(attribute, container)
{
    var url = attribute.getValueDirect().join("");
    switch (url)
    {
    case "":
        //container.htmlIconImg.src = null;
        break;

    default:
        container.htmlIconImg.src = document.location.href + "/../BwContent/" + url;
        break;
    }
}

function Label_BalloonTipLabelStyleModifiedCB(attribute, container)
{
    Label_DescriptionModifiedCB(container.description, container);   
}
LineList.prototype = new VertexGeometry();
LineList.prototype.constructor = LineList;

function LineList()
{
    VertexGeometry.call(this);
    this.className = "LineList";
    this.attrType = eAttrType.LineList;
    this.width = 1;
}

LineList.prototype.update = function(params, visitChildren)
{
    if (!this.vertexBuffer)
    {
        this.vertexBuffer = this.graphMgr.renderContext.createVertexBuffer(3);
        this.vertexBuffer.setPrimitiveType(RC_LINES);
    }
    
    // call base-class implementation
    VertexGeometry.prototype.update.call(this, params, visitChildren);
}

LineList.prototype.apply = function(directive, params, visitChildren)
{
    // call base-class impementation
    VertexGeometry.prototype.apply.call(this, directive, params, visitChildren);
}

LineList.prototype.draw = function(dissolve)
{
    // TODO
    
    this.vertexBuffer.draw();
}

LineList.prototype.buildBoundingTree = function()
{
    
}
PointList.prototype = new VertexGeometry();
PointList.prototype.constructor = PointList;

function PointList()
{
    VertexGeometry.call(this);
    this.className = "PointList";
    this.attrType = eAttrType.PointList;
    this.width = 1;
}

PointList.prototype.update = function(params, visitChildren)
{
    if (!this.vertexBuffer)
    {
        this.vertexBuffer = this.graphMgr.renderContext.createVertexBuffer(3);
        this.vertexBuffer.setPrimitiveType(RC_POINTS);
    }
    
    // call base-class implementation
    VertexGeometry.prototype.update.call(this, params, visitChildren);
}

PointList.prototype.apply = function(directive, params, visitChildren)
{
    // call base-class impementation
    VertexGeometry.prototype.apply.call(this, directive, params, visitChildren);
}

PointList.prototype.draw = function(dissolve)
{
    // TODO
    
    this.vertexBuffer.draw();
}

PointList.prototype.buildBoundingTree = function()
{
    
}
/*
======================================================================
range()

Given the value v of a periodic function, returns the equivalent value
v2 in the principal interval [lo, hi].  If i isn't NULL, it receives
the number of wavelengths between v and v2.

   v2 = v - i * (hi - lo)

For example, range( 3 pi, 0, 2 pi, i ) returns pi, with i = 1.
====================================================================== */

function range( v, lo, hi )
{
   var v2, r = hi - lo;

   if ( r == 0.0 ) {
      return { value: lo, i: 0 };
   }

   v2 = v - r * Math.floor(( v - lo ) / r );

   return { value: v2, i: -(Math.floor(( v2 - v ) / r + ( ( v2 > v ) ? 0.5 : -0.5 ))) };
}


/*
======================================================================
hermite()

Calculate the Hermite coefficients.
====================================================================== */

function hermite( t )
{
   var t2, t3;

   t2 = t * t;
   t3 = t * t2;

   var h2 = 3 * t2 - t3 - t3;
   var h1 = 1 - h2;
   var h4 = t3 - t2;
   var h3 = h4 - t2 + t;
   
   return { h1: h1, h2: h2, h3: h3, h4: h4 };
}


/*
======================================================================
bezier()

Interpolate the value of a 1D Bezier curve.
====================================================================== */

function bezier( x0, x1, x2, x3, t )
{
   var a, b, c, t2, t3;

   t2 = t * t;
   t3 = t2 * t;

   c = 3 * ( x1 - x0 );
   b = 3 * ( x2 - x1 ) - c;
   a = x3 - x0 - c - b;

   return a * t3 + b * t2 + c * t + x0;
}


/*
======================================================================
bez2_time()

Find the t for which bezier() returns the input time.  The handle
endpoints of a BEZ2 curve represent the control points, and these have
(time, value) coordinates, so time is used as both a coordinate and a
parameter for this curve type.
====================================================================== */

function bez2_time( x0, x1, x2, x3, time, t0, t1 )
{
   var v, t;

   t = t0 + ( t1 - t0 ) * 0.5;
   v = bezier( x0, x1, x2, x3, t );
   if ( Math.abs( time - v ) > .0001 ) {
      if ( v > time )
         t1 = t;
      else
         t0 = t;
      return bez2_time( x0, x1, x2, x3, time, t0, t1 );
   }
   else
      return t;
}


/*
======================================================================
bez2()

Interpolate the value of a BEZ2 curve.
====================================================================== */

function bez2( key0, key1, time )
{
   var x, y, t, t0 = 0, t1 = 1;

   if ( key0.getShape() == eKeyframeShape_Bezier2D )
      x = key0.getTime() + key0.getParams(2);
   else
      x = key0.getTime() + ( key1.getTime() - key0.getTime() ) / 3;

   t = bez2_time( key0.getTime(), x, key1.getTime() + key1.getParams(0), key1.getTime(),
      time, t0, t1 );

   if ( key0.getShape() == eKeyframeShape_Bezier2D )
      y = key0.getValue() + key0.getParams(3);
   else
      y = key0.getValue() + key0.getParams(1) / 3;

   return bezier( key0.getValue(), y, key1.getParams(1) + key1.getValue(), key1.getValue(), t );
}


/*
======================================================================
outgoing()

Return the outgoing tangent to the curve at key0.  The value returned
for the BEZ2 case is used when extrapolating a linear pre behavior and
when interpolating a non-BEZ2 span.
====================================================================== */

function outgoing( keys, key0, key1, first )
{
   var a, b, d, t, out;

   switch ( key0.getShape() )
   {
      case eKeyframeShape.TCB:
         a = ( 1 - key0.getParams(0) )
           * ( 1 + key0.getParams(1) )
           * ( 1 + key0.getParams(2) );
         b = ( 1 - key0.getParams(0) )
           * ( 1 - key0.getParams(1) )
           * ( 1 - key0.getParams(2) );
         d = key1.getValue() - key0.getValue();

         if ( key0 != first ) {
            t = ( key1.getTime() - key0.getTime() ) / ( key1.getTime() - (keys.prev(key0)).getTime() );
            out = t * ( a * ( key0.getValue() - (keys.prev(key0)).getValue() ) + b * d );
         }
         else
            out = b * d;
         break;

      case eKeyframeShape.Linear:
         d = key1.getValue() - key0.getValue();
         if ( key0 != first ) {
            t = ( key1.getTime() - key0.getTime() ) / ( key1.getTime() - (keys.prev(key0)).getTime() );
            out = t * ( key0.getValue() - (keys.prev(key0)).getValue() + d );
         }
         else
            out = d;
         break;

      case eKeyframeShape.Bezier1D:
         out = key0.getParams(1);
         if ( key0 != first )
            out *= ( key1.getTime() - key0.getTime() ) / ( key1.getTime() - (keys.prev(key0)).getTime() );
         break;

      case eKeyframeShape.Bezier2D:
         out = key0.getParams(3) * ( key1.getTime() - key0.getTime() );
         if ( Math.abs( key0.getParams(2) ) > 1e-5 )
            out /= key0.getParams(2);
         else
            out *= 1e5;
         break;

      case eKeyframeShape.Stepped:
      default:
         out = 0;
         break;
   }

   return out;
}


/*
======================================================================
incoming()

Return the incoming tangent to the curve at key1.  The value returned
for the BEZ2 case is used when extrapolating a linear post behavior.
====================================================================== */

function incoming( keys, key0, key1, last )
{
   var a, b, d, t, _in;

   switch ( key1.getShape() )
   {
      case eKeyframeShape.Linear:
         d = key1.getValue() - key0.getValue();
         if ( key1 != last ) {
            t = ( key1.getTime() - key0.getTime() ) / ( (keys.next(key1)).getTime() - key0.getTime() );
            _in = t * ( (keys.next(key1)).getValue() - key1.getValue() + d );
         }
         else
            _in = d;
         break;

      case eKeyframeShape.TCB:
         a = ( 1 - key1.getParams(0) )
           * ( 1 - key1.getParams(1) )
           * ( 1 + key1.getParams(2) );
         b = ( 1 - key1.getParams(0) )
           * ( 1 + key1.getParams(1) )
           * ( 1 - key1.getParams(2) );
         d = key1.getValue() - key0.getValue();

         if ( key1 != last ) {
            t = ( key1.getTime() - key0.getTime() ) / ( (keys.next(key1)).getTime() - key0.getTime() );
            _in = t * ( b * ( (keys.next(key1)).getValue() - key1.getValue() ) + a * d );
         }
         else
            _in = a * d;
         break;

      case eKeyframeShape.Bezier1D:
         _in = key1.getParams(0);
         if ( key1 != last )
            _in *= ( key1.getTime() - key0.getTime() ) / ( (keys.next(key1)).getTime() - key0.getTime() );
         break;
         return _in;

      case eKeyframeShape.Bezier2D:
         _in = key1.getParams(1) * ( key1.getTime() - key0.getTime() );
         if ( Math.abs( key1.getParams(0) ) > 1e-5 )
            _in /= key1.getParams(0);
         else
            _in *= 1e5;
         break;

      case eKeyframeShape.Stepped:
      default:
         _in = 0;
         break;
   }

   return _in;
}


/*
======================================================================
interpolate()

Given a list of keys and a time number, returns the interpolated 
value at that time.
====================================================================== */

function interpolate(time, keyframes, first, last, preBehavior, postBehavior)
{
    // if no keys, the value is 0
    if (keyframes.length == 0)
    {
        return 0;
    }

    // if only one key, the value is constant
    if (keyframes.length == 1)
    {
        return first.getValue();
    }

    var noff = 0;
    var _in = 0;
    var out = 0;
    var offset = 0;
    var result;

    // use pre-behavior if time is before first key time
    if (time < first.getTime())
    {
        switch (preBehavior)
        {
        case eEndBehavior.Reset:
            return 0;

        case eEndBehavior.Constant:
            return first.getValue();

        case eEndBehavior.Repeat:
            result = range(time, first.getTime(), last.getTime());
            time = result.value;
            break;

        case eEndBehavior.Oscillate:
            result = range(time, first.getTime(), last.getTime());
            time = result.value;
            noff = result.i;
            if (noff % 2)
            {
                time = last.getTime() - first.getTime() - time;
            }
            break;

        case eEndBehavior.OffsetRepeat:
            result = range(time, first.getTime(), last.getTime());
            time = result.value;
            noff = result.i;
            offset = noff * (last.getValue() - first.getValue());
            break;

        case eEndBehavior.Linear:
            out = outgoing(keyframes, first, keyframes.next(first), first) / ((keyframes.next(first)).getTime() - first.getTime());
            return out * (time - first.getTime()) + first.getValue();
        }
    }
    // use post-behavior if time is after last key time
    else if (time > last.getTime())
    {
        switch (postBehavior)
        {
        case eEndBehavior.Reset:
            return 0;

        case eEndBehavior.Constant:
            return last.getValue();

        case eEndBehavior.Repeat:
            result = range(time, first.getTime(), last.getTime());
            time = result.value;
            break;

        case eEndBehavior.Oscillate:
            result = range(time, first.getTime(), last.getTime());
            time = result.value;
            noff = result.i;
            if (noff % 2)
            {
                time = last.getTime() - first.getTime() - time;
            }
            break;

        case eEndBehavior.OffsetRepeat:
            result = range(time, first.getTime(), last.getTime());
            time = result.value;
            noff = result.i;
            offset = noff * (last.getValue() - first.getValue());
            break;

        case eEndBehavior.Linear:
            _in = incoming(keyframes, keyframes.prev(last), last, last) / (last.getTime() - (keyframes.prev(last)).getTime());
            return _in * (time - last.getTime()) + last.getValue();
        }
    }

    // get the endpoints of the interval being evaluated 
    var key0 = first;
    while (keyframes.next(key0) && 
           time > (keyframes.next(key0)).getTime())
    {
        key0 = keyframes.next(key0);
    }
    var key1 = keyframes.next(key0);

    // check for singularities first 
    if (time == (key0).getTime())
    {
       return (key0).getValue() + offset;
    }
    else if (time == (key1).getTime())
    {
       return (key1).getValue() + offset;
    }

    // get interval length, time in [0, 1] 
    var t = (time - (key0).getTime()) / ((key1).getTime() - (key0).getTime());

    // interpolate 
    switch ((key1).getShape())
    {
    case eKeyframeShape.TCB:
    case eKeyframeShape.Bezier1D:
        {
            out = outgoing(keyframes, key0, key1, first);
            _in = incoming(keyframes, key0, key1, last);
            var result = hermite(t);
            return result.h1 * (key0).getValue() + result.h2 * (key1).getValue() + result.h3 * out + result.h4 * _in + offset;
        }

    case eKeyframeShape.Bezier2D:
        return bez2(key0, key1, time) + offset;

    case eKeyframeShape.Linear:
        return (key0).getValue() + t * ((key1).getValue() - (key0).getValue()) + offset;

    case eKeyframeShape.Stepped:
        return (key0).getValue() + offset;

    default:
        return 0;
    }

}
function StateRec()
{
    this.material = null;
    this.renderStateRec = null;
    this.cullBackFace = false;
    this.textures = null;
    this.projectionTextures = null;
    this.globalIllumination = new Color();
}

function GetCurrentState(graphMgr)
{
    var rec = new StateRec();
	
    rec.material = graphMgr.getCurrentMaterial();
    rec.renderStateRec = graphMgr.renderState.getState(RENDERSTATE_ALL_BITS);
    rec.cullBackFace = graphMgr.renderContext.enabled(eRenderMode.CullBackFace);
    rec.textures = graphMgr.textureArrayStack.top();
    rec.projectionTextures = graphMgr.projectionTextureArrayStack.top();
    rec.globalIllumination.copy(graphMgr.renderContext.getGlobalIllumination());
    
    return rec;
}

function SetCurrentState(graphMgr, stateRec)
{
    graphMgr.setCurrentMaterial(stateRec.material);
    graphMgr.renderState.setState(RENDERSTATE_ALL_BITS, stateRec.renderStateRec);
    if (stateRec.cullBackFace)
    {
        graphMgr.renderContext.enable(eRenderMode.CullBackFace);
    }
    else
    {
        graphMgr.renderContext.disable(eRenderMode.CullBackFace);
    }
    graphMgr.textureArrayStack.load(stateRec.textures);
    graphMgr.projectionTextureArrayStack.load(stateRec.projectionTextures);
    graphMgr.renderContext.setGlobalIllumination(stateRec.globalIllumination);
}
function DistanceSortRec(distance,
                         geometry,
                         dissolve)
{
    this.distance = distance || 0;
    this.geometry = geometry || null;
    this.dissolve = dissolve || 0;
    this.stateRec = null;
}

DistanceSortAgent.prototype = new Agent();
DistanceSortAgent.prototype.constructor = DistanceSortAgent;

function DistanceSortAgent()
{
    Agent.call(this);
    this.className = "DistanceSortAgent";

    this.graphMgr = null;
    this.sortRecs = [];
}

DistanceSortAgent.prototype.setGraphMgr = function(graphMgr)
{
    this.graphMgr = graphMgr;
}

DistanceSortAgent.prototype.isEmpty = function()
{
    return this.sortRecs.length == 0;
}

DistanceSortAgent.prototype.addGeometry = function(geometry, min, max, dissolve)
{
    var rec = new DistanceSortRec();

    rec.geometry = geometry;
    rec.dissolve = dissolve;
    rec.stateRec = GetCurrentState(this.graphMgr);

    // calculate distance from camera
    var worldViewMatrix = new Matrix4x4();
    worldViewMatrix.loadMatrix(this.graphMgr.renderContext.modelViewMatrixStack.top());

    // initialize
    rec.distance = FLT_MAX;

    // take smallest z of worldView-transformed endpoints of the geometry's bbox as distance from camera
    var p;
    for (var i = 0; i < 8; i++)
    {
        switch (i)
        {
            case 0: p = new Vector3D(max.x, max.y, max.z); break;
            case 1: p = new Vector3D(max.x, max.y, min.z); break;
            case 2: p = new Vector3D(max.x, min.y, max.z); break;
            case 3: p = new Vector3D(max.x, min.y, min.z); break;
            case 4: p = new Vector3D(min.x, max.y, max.z); break;
            case 5: p = new Vector3D(min.x, max.y, min.z); break;
            case 6: p = new Vector3D(min.x, min.y, max.z); break;
            case 7: p = new Vector3D(min.x, min.y, min.z); break;
        }

        p = worldViewMatrix.transform(p.x, p.y, p.z, 1);

        rec.distance = Math.min(p.z, rec.distance);
    }

    // add to list
    this.sortRecs.push(rec);
    
}

DistanceSortAgent.prototype.clear = function()
{
    this.sortRecs.length = 0;
}

DistanceSortAgent.prototype.sort = function()
{
    this.sortRecs.sort(DistanceSortAgent_CompareSortRecs);
}

DistanceSortAgent.prototype.draw = function()
{
    if (this.sortRecs.length == 0)
    {
        return;
    }

    // push state
    var saveState = GetCurrentState(this.graphMgr);

    // disable writing to the depth buffer
    // technique described in the OpenGL Programming Guide, 2nd edition, pp. 222-223
    //this.graphMgr.renderContext.disable(eRenderMode.DepthBufferWrite);

    for (var i = 0; i < this.sortRecs.length; i++)
    {
        // set state according to sort rec
        SetCurrentState(this.graphMgr, this.sortRecs[i].stateRec);

        // draw
        this.sortRecs[i].geometry.draw(this.sortRecs[i].dissolve);

        // pop clip plane state
        // NOTE: D3D is having issues with clip plane states when more than 1 sort rec was present
        this.graphMgr.renderState.setState(RENDERSTATE_CLIP_PLANE_BIT, saveState.renderStateRec);
    }

    // restore depth buffer write state
    this.graphMgr.renderContext.enable(eRenderMode.DepthBufferWrite);

    // pop state
    SetCurrentState(this.graphMgr, saveState);
}

function DistanceSortAgent_CompareSortRecs(rec1, rec2)
{
    return rec2.distance - rec1.distance;
}
/// <b>Approximate</b> radius of Earth at the equator (in Km).
/// For a more precise value, use either the Ellipsoid corresponding to a
/// particular datum or calculate the radius for a given latitude using
/// Synder's Formula
/// @see
var EARTH_RADIUS_KM_EQ = 6378;

/// <b>Approximate</b> radius of Earth at the poles (in Km).
var EARTH_RADIUS_KM_P = 6377;

/// Maximum width of a UTM zone (taken to be at equator)
var UTM_ZONE_WIDTH_KM = 667.956; 

// EqualArc projection - Metric
var EQ_ARC_WIDTH_KM       = 40075.16;	// Earth circumference at Equator
var EQ_ARC_HEIGHT_KM      = 40008.0;    // Earth circumference from pole to pole
var EQ_ARC_ONE_DEG_LAT_KM = EQ_ARC_HEIGHT_KM / 360;
var EQ_ARC_ONE_DEG_LON_KM = EQ_ARC_WIDTH_KM / 360;

// EqualArc projection - English
var EQ_ARC_WIDTH_MI       = 24902.0;
var EQ_ARC_HEIGHT_MI      = 24900.0;
var EQ_ARC_ONE_DEG_LAT_MI = EQ_ARC_HEIGHT_MI / 360;
var EQ_ARC_ONE_DEG_LON_MI = EQ_ARC_WIDTH_MI / 360;

MapProjectionCalculator.prototype = new Evaluator();
MapProjectionCalculator.prototype.constructor = MapProjectionCalculator;

function MapProjectionCalculator()
{
    Evaluator.call(this);
    this.className = "MapProjectionCalculator";
    this.attrType = eAttrType.MapProjectionCalculator;

    this.unitsMultiplier = 1;
    this.positionCalculators = [];
    this.geoPositionCalculators = [];
    
    this.mapProjection = new StringAttr("equalArc");
    this.elevationModel = new StringAttr();
    this.center2D = new Vector2DAttr(0, 0);
    this.units = new StringAttr("kilometers");
    this.geoPosition = new Vector3DAttr(0, 0, 0);
    this.pointWorld = new Vector3DAttr();
    this.resultPosition = new Vector3DAttr();
    this.resultGeoPosition = new Vector3DAttr();

    this.units.addModifiedCB(MapProjectionCalculator_UnitsModifiedCB, this);
    this.pointWorld.addModifiedCB(MapProjectionCalculator_PointWorldModifiedCB, this);
    
    this.registerAttribute(this.mapProjection, "mapProjection");
    this.registerAttribute(this.elevationModel, "elevationModel");
    this.registerAttribute(this.center2D, "center2d");
    this.registerAttribute(this.units, "units");
    this.registerAttribute(this.geoPosition, "geoPosition");
    this.registerAttribute(this.geoPosition, "position"); // backward-compatibility
    this.registerAttribute(this.pointWorld, "pointWorld");
    this.registerAttribute(this.resultPosition, "resultPosition");
    this.registerAttribute(this.resultGeoPosition, "resultGeoPosition");
    this.registerAttribute(this.resultGeoPosition, "resultGeoLocation"); // backward-compatibility

    this.positionCalculators["equalArc"] = ComputeEqualArc3DPosition;
    this.geoPositionCalculators["equalArc"] = ComputeEqualArcGeoPosition;

    this.units.setValueDirect("meters"); // invoke modified cb
}

MapProjectionCalculator.prototype.evaluate = function()
{
    var geoPosition = this.geoPosition.getValueDirect();

    var resultPosition = this.computePosition(geoPosition.x, geoPosition.y, geoPosition.z);
    this.resultPosition.setValueDirect(resultPosition.x, resultPosition.y, resultPosition.z);

    var resultGeoPosition = this.computeGeoPosition(resultPosition.x, resultPosition.y, resultPosition.z);
    this.resultGeoPosition.setValueDirect(resultGeoPosition.x, resultGeoPosition.y, resultGeoPosition.z);
}

MapProjectionCalculator.prototype.computePosition = function(lon, alt, lat)
{
    var position = undefined;
    
    var mapProjection = this.mapProjection.getValueDirect().join("");
    var computeFunc = this.positionCalculators[mapProjection];
    if (computeFunc)
    {
        var center2D = this.center2D.getValueDirect();
        position = computeFunc(lon, alt, lat, center2D.x, center2D.y, this.unitsMultiplier);
    }

    return position;
}

MapProjectionCalculator.prototype.computeGeoPosition = function(x, y, z)
{
    var geoPosition = undefined;

    var mapProjection = this.mapProjection.getValueDirect().join("");
    var computeFunc = this.geoPositionCalculators[mapProjection];
    if (computeFunc)
    {
        var center2D = this.center2D.getValueDirect();
        geoPosition = computeFunc(x, y, z, center2D.x, center2D.y, this.unitsMultiplier);
    }

    return geoPosition;
}

function MapProjectionCalculator_UnitsModifiedCB(attribute, container)
{
    switch (attribute.getValueDirect().join(""))
    {
        case "kilometers":
            {
                container.unitsMultiplier = 1;
            }
            break;

        case "meters":
            {
                container.unitsMultiplier = 1000;
            }
            break;
    }
}

function MapProjectionCalculator_PointWorldModifiedCB(attribute, container)
{
    // TODO
}

function ComputeEqualArc3DPosition(lon, alt, lat, centerLon, centerLat, units)
{
    if (lat > 90  || lat < -90 ||
		lon > 180 || lon < -180)
	{
		return undefined;
	}
	
	var x = (lon - centerLon) * EQ_ARC_ONE_DEG_LON_KM * units;
	var y = alt;
	var z = (lat - centerLat) * EQ_ARC_ONE_DEG_LAT_KM * units;

	return { x: x, y: y, z: z }
}

function ComputeEqualArcGeoPosition(x, y, z, centerLon, centerLat, units)
{
	var lon = (x / units / EQ_ARC_ONE_DEG_LON_KM) + centerLon;
	var alt = y;
	var lat = (z / units / EQ_ARC_ONE_DEG_LAT_KM) + centerLat;   
    
    return { lon: lon, alt: alt, lat: lat }
}
NullObject.prototype = new ParentableMotionElement();
NullObject.prototype.constructor = NullObject;

function NullObject()
{
    ParentableMotionElement.call(this);
    this.className = "NullObject";
    this.attrType = eAttrType.NullObject;
}
Transform.prototype = new SGNode();
Transform.prototype.constructor = Transform;

/**
 * Defines a generic matrix transformation.
 *
 * @see GcSGNode
 */
function Transform()
{
    SGNode.call(this);
    this.className = "Transform";
    this.attrType = eAttrType.Transform;
    
    this.matrix = new Matrix4x4Attr
       (1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1);
        
    this.matrixTransform = this.matrix.getValueDirect();
    this.updateMatrix = true;

    this.matrix.addModifiedCB(Transform_MatrixModifiedCB, this);

    this.registerAttribute(this.matrix, "matrix");
}

Transform.prototype.clone = function(src)
{
    this.matrix = src.matrix.clone();
    this.updateMatrix = src.updateMatrix;
}

Transform.prototype.update = function(params, visitChildren)
{
    if (this.updateMatrix)
    {
        this.updateMatrix = false;

        this.matrixTransform = this.matrix.getValueDirect();
    }
    
    // call base-class implementation
    SGNode.prototype.update.call(this, params, visitChildren);
}

Transform.prototype.apply = function(directive, params, visitChildren)
{
    if (!this.enabled.getValueDirect())
    {
        // call base class implementation
        SGNode.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }
    
    if (params.worldMatrix)
    {
        params.worldMatrix = params.worldMatrix.leftMultiply(this.matrixTransform);
    }
            
    switch (directive)
    {
        case "render":
        {
            this.applyTransform();
        }
        break;
         
        default:
            break;
    }

    // call base class implementation
    SGNode.prototype.apply.call(this, directive, params, visitChildren);
}

Transform.prototype.applyTransform = function()
{
    // set transformation matrix
    this.graphMgr.renderContext.setMatrixMode(RC_MODELVIEW);
    this.graphMgr.renderContext.leftMultMatrix(this.matrixTransform);
    this.graphMgr.renderContext.applyModelViewTransform();
}

function Transform_MatrixModifiedCB(attribute, container)
{
    container.updateMatrix = true;
    container.incrementModificationCount();
}


QuaternionRotate.prototype = new Transform();
QuaternionRotate.prototype.constructor = QuaternionRotate;

function QuaternionRotate()
{
    Transform.call(this);
    this.className = "QuaternionRotate";
    this.attrType = eAttrType.QuaternionRotate;

    this.rotationQuat = new QuaternionAttr(1, 0, 0, 0);
    this.rotation = new Vector3DAttr(0, 0, 0);
    this.updateRotationQuat = true;

    this.rotationQuat.addModifiedCB(QuaternionRotate_RotationQuatModifiedCB, this);

    this.registerAttribute(this.rotationQuat, "rotationQuat");
    this.registerAttribute(this.rotation, "rotation");
}

QuaternionRotate.prototype.update = function(params, visitChildren)
{
    if (this.updateRotationQuat)
    {
        this.updateRotationQuat = false;

        var q = this.rotationQuat.getValueDirect();

        var matrix = q.getMatrix();
        this.matrix.setValueDirect(matrix);

        var rotation = matrix.getRotationAngles();
        this.rotation.setValueDirect(rotation.x, rotation.y, rotation.z);
        
        //console.debug("QuaternionRotate: rotation " + rotation.x + ", " + 
        //rotation.y + ", " + rotation.z);
    }

    // call base-class implementation
    Transform.prototype.update.call(this, params, visitChildren);
}

QuaternionRotate.prototype.apply = function(directive, params, visitChildren)
{
    if (!this.enabled.getValueDirect())
    {
        // call base-class implementation
        Transform.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }

    // call base-class implementation
    Transform.prototype.apply.call(this, directive, params, visitChildren);
}

function QuaternionRotate_RotationQuatModifiedCB(attribute, container)
{
    container.updateRotationQuat = true;
    container.incrementModificationCount();
}
Rotate.prototype = new Transform();
Rotate.prototype.constructor = Rotate;

function Rotate()
{
    Transform.call(this);
    this.className = "Rotate";
    this.attrType = eAttrType.Rotate;
    
    this.rotation = new Vector3DAttr(0, 0, 0);
    this.updateRotation = true;
    
    this.rotation.addModifiedCB(Rotate_RotationModifiedCB, this);
	
    this.registerAttribute(this.rotation, "rotation");
}

Rotate.prototype.update = function(params, visitChildren)
{
    if (this.updateRotation)
    {
        this.updateRotation = false;

        var r = this.rotation.getValueDirect();

        var matrix = new Matrix4x4()
        matrix.loadXYZAxisRotation(r.x, r.y, r.z);
        this.matrix.setValueDirect(matrix);
    }

    // call base-class implementation
    Transform.prototype.update.call(this, params, visitChildren);
}

Rotate.prototype.apply = function(directive, params, visitChildren)
{
    if (!this.enabled.getValueDirect())
    {
        // call base-class implementation
        Transform.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }

    // call base-class implementation
    Transform.prototype.apply.call(this, directive, params, visitChildren);
}

function Rotate_RotationModifiedCB(attribute, container)
{
    container.updateRotation = true;
    container.incrementModificationCount();
}
Scale.prototype = new Transform();
Scale.prototype.constructor = Scale;

function Scale()
{
    Transform.call(this);
    this.className = "Scale";
    this.attrType = eAttrType.Scale;
    
    this.scale = new Vector3DAttr(1, 1, 1);
    this.updateScale = true;
    
    this.scale.addModifiedCB(Scale_ScaleModifiedCB, this);
	
    this.registerAttribute(this.scale, "scale");
}

Scale.prototype.update = function(params, visitChildren)
{
    if (this.updateScale)
    {
        this.updateScale = false;

        var s = this.scale.getValueDirect();

        var matrix = new Matrix4x4();
        matrix.loadScale(s.x, s.y, s.z);
        this.matrix.setValueDirect(matrix);
    }

    // call base-class implementation
    Transform.prototype.update.call(this, params, visitChildren);
}

Scale.prototype.apply = function(directive, params, visitChildren)
{
    if (!this.enabled.getValueDirect())
    {
        // call base-class implementation
        Transform.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }

    // call base-class implementation
    Transform.prototype.apply.call(this, directive, params, visitChildren);
}

function Scale_ScaleModifiedCB(attribute, container)
{
    container.updateScale = true;
    container.incrementModificationCount();
}
Translate.prototype = new Transform();
Translate.prototype.constructor = Translate;

function Translate()
{
    Transform.call(this);
    this.className = "Translate";
    this.attrType = eAttrType.Translate;
    
    this.translation = new Vector3DAttr(0, 0, 0);
    this.updateTranslation = true;
    
    this.translation.addModifiedCB(Translate_TranslationModifiedCB, this);
	
    this.registerAttribute(this.translation, "translation");
}

Translate.prototype.update = function(params, visitChildren)
{
    if (this.updateTranslation)
    {
        this.updateTranslation = false;

        var t = this.translation.getValueDirect();

        var matrix = new Matrix4x4();
        matrix.loadTranslation(t.x, t.y, t.z);
        this.matrix.setValueDirect(matrix);
    }

    // call base-class implementation
    Transform.prototype.update.call(this, params, visitChildren);
}

Translate.prototype.apply = function(directive, params, visitChildren)
{
    if (!this.enabled.getValueDirect())
    {
        // call base-class implementation
        Transform.prototype.apply.call(this, directive, params, visitChildren);
        return;
    }

    // call base-class implementation
    Transform.prototype.apply.call(this, directive, params, visitChildren);
}

function Translate_TranslationModifiedCB(attribute, container)
{
    container.updateTranslation = true;
    container.incrementModificationCount();
}
SerializeParams.prototype = new DirectiveParams();
SerializeParams.prototype.constructor = SerializeParams();

function SerializeParams()
{
    DirectiveParams.call(this);
    
    this.serialized = "";
}

SerializeDirective.prototype = new SGDirective();
SerializeDirective.prototype.constructor = SerializeDirective;

function SerializeDirective()
{
    SGDirective.call(this);
    
    this.className = "SerializeDirective";
    this.attrType = eAttrType.SerializeDirective;

}

SerializeDirective.prototype.execute = function(root)
{
    if (!root)
    {
		return;
	}

    // clear serialize string
    this.serialized = "";

    // setup serialize params structure
    var serializeParams = new SerializeParams();
    serializeParams.serialized = this.serialized;
    serializeParams.userData = this.userData.getValueDirect();

    // apply serialize directive
    root.apply(eAttrType.DirectiveSerialize, serializeParams, true);

    return;
}

SerializeDirective.prototype.execute = function(path)
{
    if (!path)
    {
        return;
    }

    // clear serialize string
    this.serialized = "";

    // setup serialize params structure
    var serializeParams = new SerializeParams();
    serializeParams.serialized = this.serialized;
    serializeParams.userData = this.userData.getValueDirect();

	// apply serialize directive
    if (path.getNodeCount() > 0)
    {
	    path[0].apply(eAttrType.DirectiveSerialize, serializeParams, true);
    }

	return;
}

var eEventType = {
    Unknown                     :-1,
    
    Mouse_First                 :100,
    MouseMove                   :101,
    MouseDown                   :102,
    MouseLeftDown               :103,
    MouseMiddleDown             :104,
    MouseRightDown              :105,
    MouseAllDown                :106,
    MouseBothDown               :107,
    MouseWheelDown              :108,
    MouseUp                     :109,
    MouseLeftUp                 :110,
    MouseRightUp                :111,
    MouseMiddleUp               :112,
	MouseWheelUp                :113,
	MouseLeftClick              :114,
	MouseMiddleClick            :115,
	MouseRightClick             :116,
    MouseLeftDblClick           :117,
	MouseMiddleDblClick         :118,
    MouseRightDblClick          :119,
    MouseDrag                   :120,
    MouseWheelForward           :121,
    MouseWheelBackward          :122,
	MouseHover                  :123,
	MouseLeave                  :124,	// fires when the mouse leaves the client area of the window
	MouseOver                   :125,	// fires when the mouse is moved onto an element
	MouseOut                    :126,	// fires when the mouse is moved off an element
    Mouse_Last                  :199,

    Key_First                   :200,
    Key_Down                    :201,
    Key_Up                      :202,
    Key_Last                    :299,
    
    Element_First               :700,
    ElementSelected             :701,
    ElementUnselected           :702,
    ElementFocus                :703,
    ElementBlur                 :704,
    Element_Last                :799,
    
    UserDefined                 :2000
};

var eEventNameMap = {
    "MButton1"                  : eEventType.MouseLeftDown,
    "MButton1.Down"             : eEventType.MouseLeftDown,
    "MButton2"                  : eEventType.MouseMiddleDown,
    "MButton2.Down"             : eEventType.MouseMiddleDown,
    "MButton3"                  : eEventType.MouseRightDown,
    "MButton3.Down"             : eEventType.MouseRightDown,
    "MButton1+MButton2.Down"    : eEventType.MouseBothDown,
	"MButton2+MButton3.Down"    : eEventType.MouseBothDown,
	"MButton1+MButton3.Down"    : eEventType.MouseBothDown,
    "MButton1.Click"            : eEventType.MouseLeftClick,
	"MButton1.DoubleClick"      : eEventType.MouseLeftDblClick,
	"MButton1.Up"               : eEventType.MouseLeftUp,
    "MButton2.Click"            : eEventType.MouseMiddleClick,
	"MButton2.DoubleClick"      : eEventType.MouseMiddleDblClick,
	"MButton2.Up"               : eEventType.MouseMiddleUp,
	"MButton3.Click"            : eEventType.MouseRightClick,
	"MButton3.DoubleClick"      : eEventType.MouseRightDblClick,
	"MButton3.Up"               : eEventType.MouseRightUp,
    "MWheel"                    : eEventType.MouseWheelDown,
	"MWheel.Down"               : eEventType.MouseWheelDown,
    "MWheel.Click"              : eEventType.MouseWheelUp,
	"MWheel.Up"                 : eEventType.MouseWheelUp,
	"Mouse.Move"                : eEventType.MouseMove,
	"Mouse.Hover"               : eEventType.MouseHover,
	"Mouse.Leave"               : eEventType.MouseLeave,
	"Mouse.Over"                : eEventType.MouseOver,
	"Mouse.Out"                 : eEventType.MouseOut,
	"Element.Selected"          : eEventType.ElementSelected,
	"Element.Unselected"        : eEventType.ElementUnselected,
	"Element.Focus"             : eEventType.ElementFocus,
	"Element.Blur"              : eEventType.ElementBlur
};

function getEventTypeByName(name)
{
    var type = eEventNameMap[name];
    
    if (type == undefined)
    {
        // TODO  
        type = eEventType.Unknown;      
    }   
    
    return type;
}
Event.prototype = new AttributeContainer();
Event.prototype.constructor = Event;

function Event(type, time, userData)
{
    AttributeContainer.call(this);
    this.className = "Event";
    
    this.type = type || eEventType.Unknown;
    this.time = time || 0;
    this.userData = userData || null;
}

Event.prototype.synchronize = function(src)
{
    this.type = src.type;
    this.time = src.time;
    this.userData = src.userData;
}
InputEvent.prototype = new Event();
InputEvent.prototype.constructor = InputEvent;

function InputEvent(type, time, inputId, modifiers, state, userData)
{
    Event.call(this, type, time, userData);
    this.className = "InputEvent";
    
    this.inputId = inputId || 0;
    this.modifiers = modifiers || 0;
    this.state = state || 0;
}

InputEvent.prototype.synchronize = function(src)
{
	this.inputId = src.inputId;
	this.modifiers = src.modifiers;
	this.state = src.state;

	Event.prototype.synchronize.call(this, src);
}
var MOUSEEVENT_LEFT_BUTTON     = 0x0001;
var MOUSEEVENT_MIDDLE_BUTTON   = 0x0002;
var MOUSEEVENT_RIGHT_BUTTON    = 0x0004;

MouseEvent.prototype = new InputEvent();
MouseEvent.prototype.constructor = MouseEvent;

function MouseEvent(type, time, buttonId, modifiers, state, x, y, userData)
{
    InputEvent.call(this, type, time, buttonId, modifiers, state, userData);
    this.className = "MouseEvent";
    
    this.x = x || 0;
    this.y = y || 0;
}
function MouseEventState()
{
    this.leftButtonDown = false;
    this.middleButtonDown = false;
    this.rightButtonDown = false;
}

EventAdapter.prototype = new AttributeContainer();
EventAdapter.prototype.constructor = EventAdapter;

function EventAdapter()
{
    AttributeContainer.call(this);
    this.className = "EventAdapter";
    
    this.mouseState = new MouseEventState();
    
    this.name = new StringAttr("EventAdapter");
    
    this.registerAttribute(this.name, "name");
}

EventAdapter.prototype.createKeyboardEvent = function(event)
{
    var keyboardEvent = null;//new KeyboardEvent(type, time, buttonId, modifiers, state, x, y);
    return keyboardEvent;
}

EventAdapter.prototype.createMouseEvent = function(event)
{
    var date = new Date();
    
    var type = eEventType.Unknown;
    var time = date.getTime();
    var buttonId = 0;
    var modifiers = 0;  // TODO
    var state = 0;      // TODO
    
    var x = event.canvasX;
    var y = event.canvasY;

    switch (event.type)
    {
    case "click":
        {
            switch (event.button)
            {
            case 0: type = eEventType.MouseLeftClick; break;
            case 1: type = eEventType.MouseMiddleDown; break;
            case 2: type = eEventType.MouseRightClick; break;
            } 
        }
        break;

    case "dblclick":
        {
            switch (event.button)
            {
            case 0: type = eEventType.MouseLeftDblClick; break;
            case 1: type = eEventType.MouseMiddleDblClick; break;
            case 2: type = eEventType.MouseRightDblClick; break;
            }    
        }
        break;
        
    case "mousedown":
        {
            switch (event.button)
            {
            case 0:
                { 
                    if (this.mouseState.rightButtonDown)
                    {
                        type = eEventType.MouseBothDown;
                    }
                    else 
                    {
                        type = eEventType.MouseLeftDown;
                    }
                    this.mouseState.leftButtonDown = true;
                }
                break;
                
            case 1: 
                {
                    type = eEventType.MouseMiddleDown;
                    this.mouseState.middleButtonDown = true;
                }
                break;
                
            case 2: 
                {
                    if (this.mouseState.leftButtonDown)
                    {
                        type = eEventType.MouseBothDown;
                    }
                    else 
                    {
                        type = eEventType.MouseRightDown;
                    }
                    this.mouseState.rightButtonDown = true;
                }
                break;
            }
        }
        break;
      
    case "mouseup":
        {
            switch (event.button)
            {
            case 0:
                { 
                    type = eEventType.MouseLeftUp; 
                    this.mouseState.leftButtonDown = false;
                }
                break;
                
            case 1: 
                {
                    type = eEventType.MouseMiddleUp;
                    this.mouseState.middleButtonDown = false;
                }
                break;
                
            case 2: 
                {
                    type = eEventType.MouseRightUp;
                    this.mouseState.rightButtonDown = false;
                }
                break;
            }
        }
        break;
        
    case "mousemove":
        {
            type = eEventType.MouseMove;
        }
        break;
        
    default:
        {
            type = eEventType.UserDefined; // TEMPTEST (?)
        }
        break;
    }       
    
    // set which buttons are pressed to buttonId
    if (this.mouseState.leftButtonDown)     buttonId |= MOUSEEVENT_LEFT_BUTTON;
    if (this.mouseState.middleButtonDown)   buttonId |= MOUSEEVENT_MIDDLE_BUTTON;
    if (this.mouseState.rightButtonDown)    buttonId |= MOUSEEVENT_RIGHT_BUTTON;
    
    var mouseEvent = new MouseEvent(type, time, buttonId, modifiers, state, x, y);
    
    return mouseEvent;
}
EventListener.prototype = new Agent();
EventListener.prototype.constructor = EventListener;

function EventListener()
{
    Agent.call(this);
    this.className = "EventListener";
    
    this.events = [];
    
    this.listen = new BooleanAttr(true);
    this.trigger = new StringAttr("");
    this.numResponses = new NumberAttr(1);
    this.event = new StringAttr("");
    
    this.event.addModifiedCB(EventListener_EventModifiedCB, this);
    
    this.registerAttribute(this.listen, "listen");
    this.registerAttribute(this.trigger, "trigger");
    this.registerAttribute(this.numResponses, "numResponses");
    this.registerAttribute(this.event, "event");
}

EventListener.prototype.addEventType = function(type)
{
    this.events.push(type);
}

EventListener.prototype.getEventTypes = function()
{
    return this.events;
}

EventListener.prototype.eventPerformed = function(event)
{
    // decr numResponses
    var numResponses = this.numResponses.getValueDirect();
    if (numResponses > 0)
    {
        this.numResponses.setValueDirect(numResponses-1);
    }
}
EventListener.prototype.getTrigger = function()
{
        this.trigger;
}
EventListener.prototype.setTrigger = function(trigger)
{
    if(trigger)
    {
        this.trigger = trigger;
    }
}

function EventListener_EventModifiedCB(attribute, container)
{
    var type = getEventTypeByName(attribute.getValueDirect().join(""));
    // TODO -- restore the following line when all events are defined
    //if (type != eEventType.Unknown)
    {
        container.addEventType(type);
    }
}
EventMgr.prototype = new AttributeContainer();
EventMgr.prototype.constructor = EventMgr;

function EventMgr()
{
    AttributeContainer.call(this);
    this.className = "EventMgr";
    
    this.listeners = [];
    
    this.name = new StringAttr("EventMgr");
    
    this.registerAttribute(this.name, "name");
}

EventMgr.prototype.addListener = function(type, listener)
{
    if (this.listeners[type] == undefined)
    {
        this.listeners[type] = [];
    }
    
    // only add once
    if (this.listeners[type].indexOf(listener) == -1)
    {
        this.listeners[type].push(listener);
    }
}

EventMgr.prototype.removeListener = function(type, listener)
{
    if (this.listeners[type])
    {
        this.listeners[type].splice(this.listeners[type].indexOf(listener), 1);
    }    
}

EventMgr.prototype.processEvent = function(event)
{
    var type = event.type;
    var expired = [];
    
    // process event for registered listeners
    if (this.listeners[type])
    {
        for (var i=0; i < this.listeners[type].length; i++)
        {
            this.listeners[type][i].eventPerformed(event);
            
            // if listener has finished responding, add to expired list
            if (this.listeners[type][i].getAttribute("numResponses").getValueDirect() == 0)
            {
                expired.push(this.listeners[type][i]);
            }
        }
    }
    
    // remove expired listeners
    for (var i=0; i < expired.length; i++)
    {
        this.removeListener(type, expired[i]);
        this.registry.unregister(expired[i]);
    }
}
EventMgr.prototype.clearEvents = function()
{
/*
    this.bProcessingQs = false;
    this.bPendingRegistrations = false;

    while (!this.pendingAddsQ.empty())
    {
        var elp = m_pendingAddsQ.front();
        var elist = elp.second;
        this.elist.clear();
//        SAFE_DELETE(elist);
        this.pendingAddsQ.pop();
    }

    while (!this.userInputEventsQ.empty())
    {
        var pEvent = this.userInputEventsQ.front();
        this.userInputEventsQ.pop();
//        SAFE_RELEASE(pEvent);
    }

    while (!this.sceneOutputEventsQ.empty())
    {
        var pEvent = this.sceneOutputEventsQ.front();
        this.sceneOutputEventsQ.pop();
//        SAFE_RELEASE(pEvent);
    }

    this.removeAllListeners();
    */
    this.listeners.length = 0;
}
DeviceHandler.prototype = new EventListener();
DeviceHandler.prototype.constructor = DeviceHandler;

function DeviceHandler()
{
    EventListener.call(this);
    this.className = "DeviceHandler";
    
    this.inputMessage = new NumberAttr(0);
    this.inputId = new NumberAttr(0);
    this.inputModifier = new NumberAttr(0);
    this.inputState = new NumberAttr(0);
    this.prevInputState = new NumberAttr(0);
    this.output = new StringAttr("");
    
    this.registerAttribute(this.inputMessage, "inputMessage");
    this.registerAttribute(this.inputId, "inputId");
    this.registerAttribute(this.inputModifier, "inputModifier");
    this.registerAttribute(this.inputState, "inputState");
    this.registerAttribute(this.prevInputState, "prevInputState");
    this.registerAttribute(this.output, "output");
    
    // always respond to events
    this.numResponses.setValueDirect(-1);
}

DeviceHandler.prototype.eventPerformed = function(event)
{
    this.inputMessage.setValueDirect(event.type);
    this.inputId.setValueDirect(event.inputId);
    this.inputState.setValueDirect(event.state);
    this.inputModifier.setValueDirect(event.modifiers);
}
MouseHandler.prototype = new DeviceHandler();
MouseHandler.prototype.constructor = MouseHandler;

function MouseHandler()
{
    DeviceHandler.call(this);
    this.className = "MouseHandler";
    
    this.name.setValueDirect("MouseHandler");
        
    this.lastX = 0;
    this.lastY = 0;
    
    this.x = new NumberAttr(0);
    this.y = new NumberAttr(0);
    this.deltaX = new NumberAttr(0);
    this.deltaY = new NumberAttr(0);
    this.delta = new Vector2DAttr(0, 0);
    
    this.registerAttribute(this.x, "deviceX");
    this.registerAttribute(this.y, "deviceY");
    this.registerAttribute(this.deltaX, "deltaX");
    this.registerAttribute(this.deltaY, "deltaY");
    this.registerAttribute(this.delta, "delta");
   
    this.addEventType(eEventType.MouseMove);
    this.addEventType(eEventType.MouseLeftDown);
}

MouseHandler.prototype.eventPerformed = function(event)
{
    var x = event.x;
    var y = event.y;

    switch (event.type)
    {
    	case eEventType.MouseMove:
    	{
			// do nothing
    	}
    	break;
    	
    	default:
    	{
    		this.lastX = x;
    		this.lastY = y;
    	}
    	break;
    }
   
    this.x.setValueDirect(x);
    this.y.setValueDirect(y);
    
    this.deltaX.setValueDirect(this.lastX-x);
    this.deltaY.setValueDirect(this.lastY-y);
    
    this.delta.setValueDirect(this.lastX-x, this.lastY-y);
    
    this.lastX = x;
    this.lastY = y;
    
    // call the base class to copy the rest of the InputEvent data
	DeviceHandler.prototype.eventPerformed.call(this, event);

	this.deltaX.setValueDirect(0);
	this.deltaY.setValueDirect(0);
	this.delta.setValueDirect(0, 0);
}
Command.prototype = new EventListener();
Command.prototype.constructor = Command;

function Command()
{
    EventListener.call(this);
    this.className = "Command";
    this.attrType = eAttrType.Command;
    
    this.target = new StringAttr("");
    
    this.registerAttribute(this.target, "target");
}

Command.prototype.eventPerformed = function(event)
{
    if (this.listen.getValueDirect() == true)
    {
        this.execute();
    }
    
    // call base-class implementation
    EventListener.prototype.eventPerformed.call(this, event);
}

SetCommand.prototype = new Command();
SetCommand.prototype.constructor = SetCommand;

function SetCommand()
{
    Command.call(this);
    this.className = "SetCommand";
    this.attrType = eAttrType.Set;
    
    this.attributeValuePairs = [];
    
    this.target.addModifiedCB(SetCommand_TargetModifiedCB, this);
}

SetCommand.prototype.execute = function()
{
    // TODO: enabled (? - there is a commandEnabled attaribute in .cpp)
    
    this.applyAttributeValues();
}

SetCommand.prototype.applyAttributeValues = function()
{
    for (var i=0; i < this.attributeValuePairs.length; i++)
    {
        setAttributeValue(this.attributeValuePairs[i].first, this.attributeValuePairs[i].second);
    }
}

SetCommand.prototype.registerTargetAttributes = function(target, targetName)
{
    var sname;
    var myAttribute;
    var count = target.getAttributeCount();
    for (var i=0; i < count; i++)
    {
        var attribute = target.getAttributeAt(i);
        var attributeName = target.getAttributeNameAt(i);

        // if the target has an attribute of the same name as the
		// Set, register that same attribute using a relative path
		// expression, e.g., "Container_target"
		if ((myAttribute = this.getAttribute(attributeName)) != null)
		{
			// insert relative path expression
			sName = targetName + "_";	
			sName += attributeName;	
		}
		else	// attribute is not already registered
		{
			sName = attributeName;
		}
		
		this.registerAttribute(attribute, sName);
    }    
}

function SetCommand_TargetModifiedCB(attribute, container)
{ 
    var target = attribute.getValueDirect().join("");
    var targets = target.split(",");
    
    container.targets.length = 0;
    for (var i=0; i < targets.length; i++)
    {
        var resource = container.registry.find(targets[i]);
        if (resource)
        {
            container.registerTargetAttributes(resource, targets[i]);
        }
    }
    
    setAttributeBin(container.attributeValuePairs);
}
function ConnectionDesc()
{
    this.sourceContainer = null;
    this.targetContainer = null;
    this.sourceAttribute = null;
    this.targetAttribute = null;
    this.sourceIndex = -1;
    this.targetIndex = -1;
}

var gConnectionHelpers = [];

function registerConnectionHelper(type, connect, disconnect)
{
    gConnectionHelpers[type] = new Pair(connect, disconnect);
}

ConnectAttributesCommand.prototype = new Command();
ConnectAttributesCommand.prototype.constructor = ConnectAttributesCommand;

function ConnectAttributesCommand()
{
    Command.call(this);
    this.className = "ConnectAttributesCommand";
    
    this.connections = new Stack(new ConnectionDesc());
    this.connectionHelper = new Pair(null, null);
    
    this.sourceContainer = new StringAttr("");
    this.targetContainer = new StringAttr("");
    this.sourceAttribute = new StringAttr("");
    this.targetAttribute = new StringAttr("");
    this.source = new StringAttr("");
    this.negate = new BooleanAttr(false);   // if true, disconnect
    this.persist = new BooleanAttr(true);
    this.connectionType = new StringAttr("");
    
    this.source.addTarget(this.sourceAttribute);
    this.target.addTarget(this.targetAttribute);
    
    this.sourceContainer.addModifiedCB(ConnectAttributesCommand_SourceContainerModifiedCB, this);
    this.targetContainer.addModifiedCB(ConnectAttributesCommand_TargetContainerModifiedCB, this);
    this.sourceAttribute.addModifiedCB(ConnectAttributesCommand_SourceAttributeModifiedCB, this);
    this.targetAttribute.addModifiedCB(ConnectAttributesCommand_TargetAttributeModifiedCB, this);
    this.connectionType.addModifiedCB(ConnectAttributesCommand_ConnectionTypeModifiedCB, this);
    
    this.registerAttribute(this.sourceContainer, "sourceContainer");
	this.registerAttribute(this.sourceContainer, "sourceEvaluator");
	this.registerAttribute(this.targetContainer, "targetContainer");
	this.registerAttribute(this.sourceAttribute, "sourceAttribute");
	this.registerAttribute(this.sourceAttribute, "sourceOutput");
	this.registerAttribute(this.targetAttribute, "targetAttribute");
	this.registerAttribute(this.source, "source");
	this.registerAttribute(this.negate, "negate");
	this.registerAttribute(this.persist, "persist");
	this.registerAttribute(this.connectionType, "connectionType");
}

ConnectAttributesCommand.prototype.eventPerformed = function(event)
{
    // TEMPTEST
    // call base-class implementation
    Command.prototype.eventPerformed.call(this, event);
}

ConnectAttributesCommand.prototype.execute = function()
{
    var desc = this.connections.top();
    var persist = this.persist.getValueDirect();
    
    var sourceEvaluator = null;
    if (desc.sourceContainer &&
        desc.sourceContainer.attrType >= eAttrType.Evaluator &&
        desc.sourceContainer.attrType <= eAttrType.Evaluator_End)
    {
        sourceEvaluator = desc.sourceContainer;
    }
    
    if (this.negate.getValueDirect() == false)
    {
        if (this.connectionHelper.first)
        {
            this.connectionHelper.first(desc.sourceContainer, desc.targetContainer)
            if (!persist && this.connectionHelper.second)
            {
                // if source is evaluator, evaluate
                if (sourceEvaluator) sourceEvaluator.evalute();
                
                this.connectionHelper.second(desc.sourceContainer, desc.targetContainer);
            }
        }
        else
        {
            this.addOrRemoveTargets(true);
            
            if (!persist)
            {
                // if source is evaluator, evaluate
                if (sourceEvaluator) sourceEvaluator.evalute();
                
                this.addOrRemoveTargets(false);
            }
        }
    }
    else // negate - disconnect
    {
        if (this.connectionHelper.second)
        {
            var desc = this.connections.top();
            this.connectionHelper.second(desc.sourceContainer, desc.targetContainer);
            
            // if source is evaluator, evaluate
            if (sourceEvaluator) sourceEvaluator.evalute();
        }
        else
        {
            this.addOrRemoveTargets(false);
            
            // if source is evaluator, evaluate
            if (sourceEvaluator) sourceEvaluator.evalute();
        }
    }
}

ConnectAttributesCommand.prototype.addOrRemoveTargets = function(add)
{
    for (var i=0; i < this.connections.length(); i++)
    {
        var desc = this.connections.getAt(i);
        if (desc.sourceAttribute && desc.targetAttribute)
        {
            // always remove first to ensure no duplicates
            desc.sourceAttribute.removeElementTarget(desc.targetAttribute, desc.sourceIndex, desc.targetIndex);
            if (add)
            {
                desc.sourceAttribute.addElementTarget(desc.targetAttribute, desc.sourceIndex, desc.targetIndex);
            }
            
            // detect connection of a screenPosition to anything and disable display lists
            var container = desc.sourceAttribute.getContainer();
            if (container)
            {   
                var screenPosition = container.getAttribute("screenPosition");
                if (screenPosition && screenPosition == desc.sourceAttribute)
                {
                    var autoDL = container.getAttribute("autoDisplayList");
                    if (autoDL)
                    {
                        autoDL.setValueDirect(false);    
                    }
                    
                    var enableDL = container.getAttribute("enableDisplayList");
                    if (enableDL)
                    {
                        enableDL.setValueDirect(false);    
                    }
                }
            }
        }
    }
}

function ConnectAttributesCommand_SourceContainerModifiedCB(attribute, container)
{
    var connection = container.connections.top();
    connection.sourceContainer = container.registry.find(attribute.getValueDirect().join(""));       
}

function ConnectAttributesCommand_TargetContainerModifiedCB(attribute, container)
{
    var connection = container.connections.top();     
    connection.targetContainer = container.registry.find(attribute.getValueDirect().join(""));       
}

function ConnectAttributesCommand_SourceAttributeModifiedCB(attribute, container)
{
    var source = null;
    var index = -1;
    
    var connection = container.connections.top();    
    if (connection.sourceContainer)
    {
        var sourceTokens = attribute.getValueDirect().join("").split(":");
        source = connection.sourceContainer.getAttribute(sourceTokens[0]);
        if (sourceTokens.length > 1)
        {
            index = sourceTokens[1];
        }              
    }
    else
    {
        source = container.registry.find(attribute.getValueDirect().join(""));
        if (source)
        {
            connection.sourceContainer = source.getContainer();
            if (!connection.sourceContainer) connection.sourceContainer = source;     
        }
    }
    
    connection.sourceAttribute = source;
    connection.sourceIndex = index;
    
    // if source and target attributes have both been set, push another connection desc for the next source/target pair
    if (connection.sourceAttribute && connection.targetAttribute)
    {
        container.connections.push(new ConnectionDesc());
        container.connections.top().sourceContainer = connection.sourceContainer;
        container.connections.top().targetContainer = connection.targetContainer;
    }
}

function ConnectAttributesCommand_TargetAttributeModifiedCB(attribute, container)
{
    var target = null;
    var index = -1;
    
    var connection = container.connections.top();    
    if (connection.targetContainer)
    {
        var targetTokens = attribute.getValueDirect().join("").split(":");
        target = connection.targetContainer.getAttribute(targetTokens[0]);
        if (targetTokens.length > 1)
        {
            index = targetTokens[1];
        }              
    }
    else
    {
        target = container.registry.find(attribute.getValueDirect().join(""));
        if (target)
        {
            connection.targetContainer = target.getContainer();
            if (!connection.targetContainer) connection.targetContainer = target;     
        }
    }
    
    connection.targetAttribute = target;
    connection.targetIndex = index;
    
    // if source and target attributes have both been set, push another connection desc for the next source/target pair
    if (connection.sourceAttribute && connection.targetAttribute)
    {
        container.connections.push(new ConnectionDesc());
        container.connections.top().sourceContainer = connection.sourceContainer;
        container.connections.top().targetContainer = connection.targetContainer;
    }
}

function ConnectAttributesCommand_ConnectionTypeModifiedCB(attribute, container)
{
    var helpers = gConnectionHelpers[attribute.getValueDirect().join("")];
    if (helpers)
    {
        container.connectionHelper.first = helpers.first;
        container.connectionHelper.second = helpers.second;
    }
}
AutoInterpolateCommand.prototype = new Command();
AutoInterpolateCommand.prototype.constructor = AutoInterpolateCommand;

function AutoInterpolateCommand()
{
    Command.call(this);
    this.className = "AutoInterpolateCommand";
    this.attrType = eAttrType.AutoInterpolate;

    this.attributeValuePairs = [];
    this.attributeReferencePairs = [];
    this.kfi = null;
    this.numValueChannels = 0;
    this.numReferenceChannels = 0;
    this.numChannels = 0;
    
    this.shape = new NumberAttr(eKeyframeShape.Linear);
    this.duration = new NumberAttr(1);
    this.preBehavior = new NumberAttr(eEndBehavior.Constant);
    this.postBehavior = new NumberAttr(eEndBehavior.Constant);
    this.renderAndRelease = new BooleanAttr(true);

    this.target.addModifiedCB(AutoInterpolateCommand_TargetModifiedCB, this);

    this.registerAttribute(this.shape, "shape");
    this.registerAttribute(this.duration, "duration");
    this.registerAttribute(this.preBehavior, "preBehavior");
    this.registerAttribute(this.postBehavior, "postBehavior");
    this.registerAttribute(this.renderAndRelease, "renderAndRelease");
}

AutoInterpolateCommand.prototype.execute = function()
{
    // TODO: enabled (?)

    this.buildMotion();
    if (this.kfi)
    {
        this.kfi.getAttribute("time").setValueDirect(0);
        this.kfi.getAttribute("enabled").setValueDirect(true);
    }
}

AutoInterpolateCommand.prototype.buildMotion = function()
{
    var factory = this.registry.find("AttributeFactory");
    this.kfi = factory.create("KeyframeInterpolator");
    if (!this.kfi)
    {
        return;
    }
    this.kfi.getAttribute("enabled").setValueDirect(false);
    this.kfi.getAttribute("renderAndRelease").copyValue(this.renderAndRelease);
    
    // TODO: name the interpolator based on the target

    for (var i = 0; i < this.attributeValuePairs.length; i++)
    {
        this.numValueChannels += this.attributeValuePairs[i].first.getLength();
    }
    for (var i = 0; i < this.attributeReferencePairs.length; i++)
    {
        this.numReferenceChannels += this.attributeReferencePairs[i].first.getLength();
    }
    this.numChannels = this.numValueChannels + this.numReferenceChannels;
    this.kfi.setNumChannels(this.numChannels);

    var pre = this.preBehavior.getValueDirect();
    var post = this.postBehavior.getValueDirect();
    for (var i = 0; i < this.numChannels; i++)
    {
        this.kfi.getAttribute("preBehaviors").getAt(i).setValueDirect(pre);
        this.kfi.getAttribute("postBehaviors").getAt(i).setValueDirect(post);
    }

    // apply the parsed values to the kfi
    this.applyAttributeValues();
    this.applyAttributeRefs();
}

AutoInterpolateCommand.prototype.applyAttributeValues = function()
{
    // i = channel counter, advanced by j elements each pass
    // j = element of an Attribute, always 0 for primitive Attrs or 0-length-1 for complex
    // k = index in attribute values map
    var i, j, k;
    for (i = 0, k = 0; k < this.attributeValuePairs.length; k++)
    {
        var attr = this.attributeValuePairs[k].first;
        var value = this.attributeValuePairs[k].second;

        // for each channel:
        // 1. create a starting keyframe from target's current value for each attribute
        // 2. create an ending keyframe from the value contained in the map for each attribute
        for (j = 0; j < attr.getLength(); j++)
        {
            var keyframes = this.kfi.getAttribute("channels").getAt(i + j);

            var start = new KeyframeAttr();
            var end = new KeyframeAttr();

            start.getAttribute("time").setValueDirect(0);
            end.getAttribute("time").setValueDirect(this.duration.getValueDirect());

            start.getAttribute("shape").setValueDirect(this.shape.getValueDirect());
            end.getAttribute("shape").setValueDirect(this.shape.getValueDirect());

            // ensure numerical value with parseFloat()
            var startVal = parseFloat(attr.getElement(j));
            var endVal = parseFloat(attr.getLength() > 1 ? value[j] : value);

            // if the attribute is rotational (determined by "rotation" or "angle" as the attribute name), 
            // ensure motion will be the shortest path (eliminate the spin caused by 360's)
            if (this.isAttributeRotational(attr))
            {
                var shortestPath = this.shortestPath(startVal, endVal);
                startVal = shortestPath.start;
                endVal = shortestPath.end;
            }

            start.getAttribute("value").setValueDirect(startVal);
            end.getAttribute("value").setValueDirect(endVal);

            keyframes.push_back(start);
            keyframes.push_back(end);

            // connect the interpolator's output to the attribute
            this.kfi.getAttribute("resultValues").getAt(i + j).addElementTarget(attr, 0, j)
        }

        i += j;
    }
}

AutoInterpolateCommand.prototype.applyAttributeRefs = function()
{
    // i = channel counter, advanced by j elements each pass
    // j = element of an Attribute, always 0 for primitive Attrs or 0-length-1 for complex
    // k = index in attribute values map
    var i, j, k;
    for (i = 0, k = 0; k < this.attributeReferencePairs.length; k++)
    {
        var ref = this.attributeReferencePairs[k].first;
        var attr = this.attributeReferencePairs[k].second;

        // for each channel:
        // 1. create a starting keyframe from target's current value for each attribute
        // 2. create an ending keyframe from the value contained in the map for each attribute
        for (j = 0; j < attr.getLength(); j++)
        {
            var keyframes = this.kfi.getAttribute("channels").getAt(i + j);

            var start = new KeyframeAttr();
            var end = new KeyframeAttr();

            start.getAttribute("time").setValueDirect(0);
            end.getAttribute("time").setValueDirect(this.duration.getValueDirect());

            start.getAttribute("shape").setValueDirect(this.shape.getValueDirect());
            end.getAttribute("shape").setValueDirect(this.shape.getValueDirect());

            // ensure numerical value with parseFloat()
            var startVal = parseFloat(attr.getElement(j));
            var endVal = parseFloat(ref.getElement(j));

            // if the attribute is rotational (determined by "rotation" or "angle" as the attribute name), 
            // ensure motion will be the shortest path (eliminate the spin caused by 360's)
            if (this.isAttributeRotational(attr))
            {
                var shortestPath = this.shortestPath(startVal, endVal);
                startVal = shortestPath.start;
                endVal = shortestPath.end;
            }

            start.getAttribute("value").setValueDirect(startVal);
            end.getAttribute("value").setValueDirect(endVal);

            keyframes.push_back(start);
            keyframes.push_back(end);

            // connect the interpolator's output to the attribute
            this.kfi.getAttribute("resultValues").getAt(i + j).addElementTarget(attr, 0, j)
        }

        i += j;
    }
}

AutoInterpolateCommand.prototype.registerTargetAttributes = function(target, targetName)
{
    var sname;
    var myAttribute;
    var count = target.getAttributeCount();
    for (var i = 0; i < count; i++)
    {
        var attribute = target.getAttributeAt(i);
        var attributeName = target.getAttributeNameAt(i);

        // if the target has an attribute of the same name as the
        // Set, register that same attribute using a relative path
        // expression, e.g., "Container_target"
        if ((myAttribute = this.getAttribute(attributeName)) != null)
        {
            // insert relative path expression
            sName = targetName + "_";
            sName += attributeName;
        }
        else	// attribute is not already registered
        {
            sName = attributeName;
        }

        this.registerAttribute(attribute, sName);
    }
}

AutoInterpolateCommand.prototype.isAttributeRotational = function(attr)
{
    var container = attr.getContainer();
    if (container)
    {
        var name = container.getAttributeName(attr);
        if (name)
        {
            if (name == "rotation" ||
                name == "angle")
            {
                return true;
            }
        }
    }

    return false;
}

AutoInterpolateCommand.prototype.shortestPath = function(start, end)
{
    // normalize start to [0, 360)
    var nstart = degreeNormalize(start);

    // normalize end to [0, 360]
    var nend = degreeNormalize(end);

    // calculate direct path
    var directPath = nend - nstart;
    if (directPath <= 180 && directPath >= -180) 
    {
        return { start: start, end: end }; // direct path is shortest path, no changes necessary
    }

    // if direct path > 180 or < -180, a shorter path exists
    var shortestPath = 0;
    if (directPath > 180)
    {
        shortestPath = 360 - directPath;
    }
    else //if (directPath < -180)
    {
        shortestPath = 360 + directPath;
    }

    // update start/end so that shortest path is traversed
    start = nstart;
    if (nend > nstart)
    {       
        end = nstart - shortestPath;
    }
    else
    {
        end = nstart + shortestPath;
    }
    
    return { start: start, end: end };
}

function AutoInterpolateCommand_TargetModifiedCB(attribute, container)
{
    var target = attribute.getValueDirect().join("");
    var targets = target.split(",");

    container.targets.length = 0;
    for (var i = 0; i < targets.length; i++)
    {
        var resource = container.registry.find(targets[i]);
        if (resource)
        {
            container.registerTargetAttributes(resource, targets[i]);
        }
    }

    setAttributeBin(container.attributeValuePairs);
    setAttributePairs(container.attributeReferencePairs);
}
MotionInterpolateCommand.prototype = new AutoInterpolateCommand();
MotionInterpolateCommand.prototype.constructor = MotionInterpolateCommand;

function MotionInterpolateCommand()
{
    AutoInterpolateCommand.call(this);
    this.className = "MotionInterpolateCommand";

    this.startPosition = new Vector3DAttr();
    this.endPosition = new Vector3DAttr();
    this.resultPosition = new Vector3DAttr();
    this.positionControl = new Vector3DAttr();
    this.easeIn = new BooleanAttr(true);
    this.easeOut = new BooleanAttr(true);
    this.midPosition = new Vector3DAttr();

    //this.resultPosition.addModifiedCB(MotionInterpolateCommand_ResultPositionModifiedCB, this);
    
    this.registerAttribute(this.startPosition, "startPosition");
    this.registerAttribute(this.endPosition, "endPosition");
    this.registerAttribute(this.resultPosition, "resultPosition");
    this.registerAttribute(this.positionControl, "positionControl");
    this.registerAttribute(this.easeIn, "easeIn");
    this.registerAttribute(this.easeOut, "easeOut");
}

MotionInterpolateCommand.prototype.execute = function()
{
    // call base-class implementation
    AutoInterpolateCommand.prototype.execute.call(this);
}

MotionInterpolateCommand.prototype.buildMotion = function()
{
    var factory = this.registry.find("AttributeFactory");
    this.kfi = factory.create("KeyframeInterpolator");
    if (!this.kfi)
    {
        return;
    }
    this.kfi.getAttribute("enabled").setValueDirect(false);
    this.kfi.getAttribute("renderAndRelease").copyValue(this.renderAndRelease);

    this.numChannels = 3;
    this.kfi.setNumChannels(this.numChannels);

    var pre = this.preBehavior.getValueDirect();
    var post = this.postBehavior.getValueDirect();
    for (var i = 0; i < this.numChannels; i++)
    {
        this.kfi.getAttribute("preBehaviors").getAt(i).setValueDirect(pre);
        this.kfi.getAttribute("postBehaviors").getAt(i).setValueDirect(post);
    }

    // set the keyframes
    this.setKeyframes();
}

MotionInterpolateCommand.prototype.setKeyframes = function()
{
    // get start position
    var startPosition = this.startPosition.getValueDirect();

    // get end position
    var endPosition = this.endPosition.getValueDirect();

    // get distance between start/end
    var positionDelta = distanceBetween(startPosition, endPosition);

    // get position control vector
    var positionControl = new Vector3D(); 
    positionControl.copy(this.positionControl.getValueDirect());
    positionControl.normalize();

    // get mid position
    var midPosition = new Vector3D(
        ((startPosition.x + endPosition.x) / 2) + (positionControl.x * (positionDelta / 2)),
        ((startPosition.y + endPosition.y) / 2) + (positionControl.y * (positionDelta / 2)),
        ((startPosition.z + endPosition.z) / 2) + (positionControl.z * (positionDelta / 2)));
    this.midPosition.setValueDirect(midPosition.x, midPosition.y, midPosition.z);

    // get ease-in, ease-out settings
    var easeIn = this.easeIn.getValueDirect();
    var easeOut = this.easeOut.getValueDirect();

    // get shape
    var shape = this.shape.getValueDirect();

    // get duration
    var duration = this.duration.getValueDirect();

    // for each channel...
    for (var channel = 0; channel < this.numChannels; channel++)
    {
        var keyframes = this.kfi.getAttribute("channels").getAt(channel);

        var start = new KeyframeAttr();
        var mid = new KeyframeAttr();
        var end = new KeyframeAttr();

        start.getAttribute("time").setValueDirect(0);
        mid.getAttribute("time").setValueDirect(duration * 0.5);
        end.getAttribute("time").setValueDirect(duration);

        start.getAttribute("shape").setValueDirect(shape);
        mid.getAttribute("shape").setValueDirect(shape);
        end.getAttribute("shape").setValueDirect(shape);

        start.getAttribute("value").setValueDirect(this.startPosition.getElement(channel));
        mid.getAttribute("value").setValueDirect(this.midPosition.getElement(channel));
        end.getAttribute("value").setValueDirect(this.endPosition.getElement(channel));

        keyframes.push_back(start);
        keyframes.push_back(mid);
        keyframes.push_back(end);

        this.kfi.getAttribute("resultValues").getAt(channel).addElementTarget(this.resultPosition, 0, channel);
    }
}

function MotionInterpolateCommand_ResultPositionModifiedCB(attribute, container)
{
    var value = attribute.getValueDirect();

    OutputDebugMsg("x: " + value.x + " y: " + value.y + " z: " + value.z + "\n");
}
LocateCommand.prototype = new Command();
LocateCommand.prototype.constructor = LocateCommand;

function LocateCommand()
{
    Command.call(this);
    this.className = "LocateCommand";
    this.attrType = eAttrType.Locate;

    this.targetNode = null;
    this.directive = new BBoxDirective();
    this.locator = new BBoxLocator();
    this.inspector = null;
    
	this.duration = new NumberAttr(1);
	this.transition = new BooleanAttr(true);
	this.updateClipPlanes = new BooleanAttr(false);
	this.shape = new NumberAttr(eKeyframeShape.TCB);
	this.easeIn = new BooleanAttr(true);
	this.easeOut = new BooleanAttr(true);
	this.resultPosition = new Vector3DAttr();
	this.resultFarDistance = new NumberAttr();
	this.resultWidth = new NumberAttr();
    
    this.target.addModifiedCB(LocateCommand_TargetModifiedCB, this);
    
	this.registerAttribute(this.duration, "duration");
	this.registerAttribute(this.transition, "transition");
	this.registerAttribute(this.updateClipPlanes, "updateClipPlanes");
	this.registerAttribute(this.shape, "shape");
	this.registerAttribute(this.easeIn, "easeIn");
	this.registerAttribute(this.easeOut, "easeOut");
	this.registerAttribute(this.resultPosition, "resultPosition");
	this.registerAttribute(this.resultFarDistance, "resultFarDistance");
	this.registerAttribute(this.resultWidth, "resultWidth");

    this.registerAttribute(this.locator.getAttribute("closeness"), "closeness");
    this.registerAttribute(this.locator.getAttribute("resultPivotDistance"), "resultPivotDistance");
}

LocateCommand.prototype.execute = function()
{
    if (this.targetNode)
    {
        this.locate();
    }
}

LocateCommand.prototype.locate = function()
{
    var selector = this.registry.find("Selector");
    var viewportMgr = this.registry.find("ViewportMgr");

    // get camera at last select point (if no selection has been made, gets camera at (0, 0))
    var clickPoint = selector.getAttribute("clickPoint").getValueDirect();
    var vp = viewportMgr.getViewportAtScreenXY(clickPoint.x, clickPoint.y);
    var camera = vp.camera;
    var viewport = vp.viewport;

    // get world-space bbox
    this.directive.execute(this.targetNode);
    var bounds = this.directive.getBounds();
    this.locator.getAttribute("bbox").setValueDirect(bounds.min, bounds.max);

    // get view-space bbox
    var view = vp.camera.getTransform();
    view.invert();
    this.directive.getAttribute("viewTransform").setValueDirect(view);
    this.directive.getAttribute("viewSpace").setValueDirect(true);
    this.directive.execute(this.targetNode);
    bounds = this.directive.getBounds();
    this.locator.getAttribute("bboxView").setValueDirect(bounds.min, bounds.max);

    // copy current viewport to the locator's viewport attribute
    this.locator.getAttribute("viewport").setValueDirect(viewport.x, viewport.y, viewport.width, viewport.height);

    // inputs
    var locatorNear = this.locator.getAttribute("nearDistance");
    var locatorVolume = this.locator.getAttribute("viewVolume");
    var locatorViewPosition = this.locator.getAttribute("viewPosition");
    var locatorTransform = this.locator.getAttribute("viewTransform");

    // outputs
    var locatorResultPosition = this.locator.getAttribute("resultPosition");
    var locatorResultWidth = this.locator.getAttribute("resultWidth");
    var locatorResultFarDistance = this.locator.getAttribute("resultFarDistance");
    var resultPivotDistance = this.locator.getAttribute("resultPivotDistance");

    // output targets (others determined later)
    var targetPivotDistance = null;
    var updateClipPlanes = this.updateClipPlanes.getValueDirect();
    var transition = this.transition.getValueDirect();

    if (this.inspector)
    {
        targetPivotDistance = this.inspector.getAttribute("pivotDistance");
    }

    if (resultPivotDistance && targetPivotDistance)
    {
        resultPivotDistance.addTarget(targetPivotDistance);
    }

    cameraNear = camera.getAttribute("nearDistance");
    cameraFar = camera.getAttribute("farDistance");
    cameraWidth = camera.getAttribute("width");
    cameraVolume = camera.getAttribute("viewVolume");
    cameraPosition = camera.getAttribute("sectorPosition");
    cameraWorldPosition = camera.getAttribute("sectorWorldPosition");
    cameraWorldTransform = camera.getAttribute("sectorWorldTransform");

    cameraNear.addTarget(locatorNear);
    cameraVolume.addTarget(locatorVolume);
    cameraWorldPosition.addTarget(locatorViewPosition);
    cameraWorldTransform.addTarget(locatorTransform);

    // if NOT transitioning, apply the result directly back to the camera
    if (transition == false)
    {
        locatorResultPosition.addTarget(cameraPosition);
        locatorResultWidth.addTarget(cameraWidth);

        if (updateClipPlanes)
        {
            locatorResultFarDistance.addTarget(cameraFar);
        }

        this.locator.evaluate();

        locatorResultPosition.removeTarget(cameraPosition);

        // removing null or non-targets is harmless, 
        // so no need to check, just call remove
        locatorResultWidth.removeTarget(cameraWidth);
        locatorResultFarDistance.removeTarget(cameraFar);
    }
    else
    {
        locatorResultPosition.addTarget(this.resultPosition);
        locatorResultWidth.addTarget(this.resultWidth);

        if (updateClipPlanes)
        {
            locatorResultFarDistance.addTarget(this.resultFarDistance);
        }

        this.locator.evaluate();

        locatorResultPosition.removeTarget(this.resultPosition);

        // removing null or non-targets is harmless, 
        // so no need to check, just call remove
        locatorResultWidth.removeTarget(this.resultWidth);
        locatorResultFarDistance.removeTarget(this.resultFarDistance);

        // based upon shape value, create either a normal auto-interpolator (linear), or a
        // motion-interpolator (non-linear)
        switch (this.shape.getValueDirect())
        {
            case eKeyframeShape.Stepped:
            case eKeyframeShape.TCB:
            case eKeyframeShape.Bezier1D:
            case eKeyframeShape.Bezier2D:
                {
                    var factory = this.registry.find("AttributeFactory");
                    var autoInterpolate = factory.create("MotionInterpolate");

                    autoInterpolate.getAttribute("shape").copyValue(this.shape);
                    autoInterpolate.getAttribute("easeIn").copyValue(this.easeIn);
                    autoInterpolate.getAttribute("easeOut").copyValue(this.easeOut);
                    autoInterpolate.getAttribute("startPosition").copyValue(cameraPosition);
                    autoInterpolate.getAttribute("endPosition").copyValue(this.resultPosition);
                    autoInterpolate.getAttribute("resultPosition").addTarget(cameraPosition,
                        eAttrSetOp.Replace, null, false);

                    // get camera direction vectors
                    var dirs = camera.getDirectionVectors();

                    // set the inverse camera fwd vector to the interpolator's position control
                    autoInterpolate.getAttribute("positionControl").setValueDirect(-dirs.forward.x,
					    -dirs.forward.y, -dirs.forward.z);
                }
                break;

            case eKeyframeShape.Linear:
            default:
                {
                    var factory = this.registry.find("AttributeFactory");
                    var autoInterpolate = factory.create("AutoInterpolate");

                    autoInterpolate.attributeReferencePairs.push(new Pair(this.resultPosition, cameraPosition));
                }
                break;
        }

        if (updateClipPlanes)
        {
            if (cameraWidth) autoInterpolate.attributeReferencePairs.push(new Pair(this.resultWidth, cameraWidth));
            if (cameraFar) autoInterpolate.attributeReferencePairs.push(new Pair(this.resultFarDistance, cameraFar));
        }

        autoInterpolate.target = camera;
        autoInterpolate.getAttribute("duration").copyValue(this.duration);
        autoInterpolate.execute();
        this.registry.unregister(autoInterpolate);
    }

    if (resultPivotDistance && targetPivotDistance)
    {
        resultPivotDistance.removeTarget(targetPivotDistance);
    }
}

function LocateCommand_TargetModifiedCB(attribute, container)
{
    var target = attribute.getValueDirect().join("");
    var resource = container.registry.find(target);
    if (resource)
    {
        container.targetNode = resource;
        
        // try and locate a scene inspector for updating pivotDistance
        container.inspector = container.registry.find("SceneInspector");
    }
    else
    {
        console.debug("TODO: " + arguments.callee.name);
        // TODO: target not found
        //_snprintf(msg, sizeof(msg), "LocateBBox: target=\"%s\" not found\n", name.c_str());
        // TODO: Locate a point on an object and/or in the world
    }
}

PlayCommand.prototype = new Command();
PlayCommand.prototype.constructor = PlayCommand;

function PlayCommand()
{
    Command.call(this);
    this.className = "PlayCommand";
    this.attrType = eAttrType.Play;

    this.evaluators = [];
    this.negate = new BooleanAttr(false);   // if true, Pause
    
    this.registerAttribute(this.negate, "negate");
    
    this.target.addModifiedCB(PlayCommand_TargetModifiedCB, this);

}

PlayCommand.prototype.execute = function()
{
    // TODO: enabled (?)
	var renderAgent = this.registry.find("RenderAgent");
	if (renderAgent)
	{
        // SetEvaluatorPlayState not implemented by RenderAgent
        // ePlayState_* is not implemented by RenderAgent
        if (this.evaluators.length < 1)
        {
			if (this.negate.getValueDirect() == false)
			{
				renderAgent.setEvaluatorsPlayState(ePlayState.Play);
			}
			else
			{
				renderAgent.setEvaluatorsPlayState(ePlayState.Pause);
			}
        }
        else
        {
            for (var i = 0; i < this.evaluators.length; i++)
            {
         
    			if (this.negate.getValueDirect() == false)
    			{
    				renderAgent.setEvaluatorPlayState(evaluators[i], ePlayState.Play);
    			}
    			else
    			{
    				renderAgent.setEvaluatorPlayState(evaluators[i], ePlayState.Pause);
    			}
            
            }   
        }
	}
}

function PlayCommand_TargetModifiedCB(attribute, container)
{
    var target = attribute.getValueDirect().join("");
    var targets = target.split(",");

    // find one or more evaluator to play
    container.targets.length = 0;   // copied this from Set. What does it do?
    for (var i = 0; i < targets.length; i++)
    {
        var evaluator = container.registry.find(targets[i]);
        if (evaluator)
        {
            container.evaluators[i] = evaluator;
        }
    }
}
RemoveCommand.prototype = new Command();
RemoveCommand.prototype.constructor = RemoveCommand;

function RemoveCommand()
{
    Command.call(this);
    this.className = "RemoveCommand";
    this.attrType = eAttrType.Remove;

    this.targetAttribute = null;
    
    this.target.addModifiedCB(RemoveCommand_TargetModifiedCB, this);
}

RemoveCommand.prototype.execute = function()
{
    if (this.targetAttribute)
    {
        // if node, remove from tree, and remove/unregister all children
        if (this.targetAttribute.isNode())
        {
            var i = 0;
            var parent = null;
            while ((parent = this.targetAttribute.getParent(i++)))
            {
                parent.removeChild(this.targetAttribute);
            }

            this.removeChildren(this.targetAttribute);
        }

        // remove from registry
        this.registry.unregister(this.targetAttribute);
        
        // delete
        this.targetAttribute.destroy();
    }
}

RemoveCommand.prototype.removeChildren = function(root)
{
    var child = null;
	while ((child = root.getChild(0))) // get child 0 each time because we are removing the front child
	{
		// recurse on child
		this.removeChildren(child);

		// remove from registry
		this.registry.unregister(child);

		// remove from root node
		root.removeChild(child);
	}
}

function RemoveCommand_TargetModifiedCB(attribute, container)
{
    var target = attribute.getValueDirect().join("");
    container.targetAttribute = container.registry.find(target);
}

StopCommand.prototype = new Command();
StopCommand.prototype.constructor = StopCommand;

function StopCommand()
{
    Command.call(this);
    this.className = "StopCommand";
    this.attrType = eAttrType.Stop;

    this.evaluators = [];
    
    this.target.addModifiedCB(StopCommand_TargetModifiedCB, this);

}

StopCommand.prototype.execute = function()
{
    // TODO: enabled (?)
	var renderAgent = this.registry.find("RenderAgent");
	if (renderAgent)
	{
        // SetEvaluatorStopState not implemented by RenderAgent
        // eStopState_* is not implemented by RenderAgent
        if (this.evaluators.length < 1)
        {
			renderAgent.setEvaluatorsPlayState(ePlayState.Stop);
        }
        else
        {
            for (var i = 0; i < this.evaluators.length; i++)
            {
         
    			renderAgent.setEvaluatorPlayState(evaluators[i], ePlayState.Stop);
            }   
        }
	}
}

function StopCommand_TargetModifiedCB(attribute, container)
{
    var target = attribute.getValueDirect().join("");
    var targets = target.split(",");

    // find one or more evaluator to play
    container.targets.length = 0;   // copied this from Set. What does it do?
    for (var i = 0; i < targets.length; i++)
    {
        var evaluator = container.registry.find(targets[i]);
        if (evaluator)
        {
            container.evaluators[i] = evaluator;
        }
    }
}
CommandSequence.prototype = new Command();
CommandSequence.prototype.constructor = CommandSequence;

function CommandSequence()
{
    Command.call(this);
    this.className = "CommandSequence";
    this.attrType = eAttrType.CommandSequence;
    
    this.sequence = [];
}

CommandSequence.prototype.execute = function()
{
    for (var i=0; i < this.sequence.length; i++)
    {
        this.sequence[i].execute();
    }
}

CommandSequence.prototype.addCommand = function(command)
{
    this.sequence.push(command);
}
CommandMgr.prototype = new AttributeContainer();
CommandMgr.prototype.constructor = CommandMgr;

function CommandMgr()
{
    AttributeContainer.call(this);
    this.className = "CommandMgr";
    
    this.sequenceStack = new Stack();
    
    this.name = new StringAttr("CommandMgr");
    
    this.registerAttribute(this.name, "name");
}

CommandMgr.prototype.pushCommandSequence = function(sequence)
{
    this.sequenceStack.push(sequence);
}

CommandMgr.prototype.popCommandSequence = function()
{
    this.sequenceStack.pop();
}

CommandMgr.prototype.clearCommandSequence = function()
{
    this.sequenceStack.clear();
}

CommandMgr.prototype.addCommand = function(command)
{
    if (this.sequenceStack.length > 0)
    {
        this.sequenceStack.top().addCommand(command);
        return;
    }
    
    // execute the command or register it for events.  If the command
    // was NOT configured for events, then Execute it and get rid of it             
    var events = command.getEventTypes();
    var trigger = command.getAttribute("trigger");
    if (events.length > 0)
    {
        var eventMgr = this.registry.find("EventMgr");
        if (eventMgr)
        {
            for (var i=0; i < events.length; i++)
            {
                eventMgr.addListener(events[i], command);
            }
        }   
    }
    else if (trigger.getLength() > 0)
    {
		trigger.addModifiedCB(CommandMgr_CommandTriggerModifiedCB, this);
		this.createCommandTrigger(command, trigger);
    }
    else // no events -- execute and remove
    {
        command.execute();
        this.registry.unregister(command);
    }
    
    setAttributeBin(null);
}

CommandMgr.prototype.createCommandTrigger = function(command, trigger) 
 {

 	// TODO: Support Commands that Execute from Events AND Triggers

 	// trigger syntax based on Attributes:
 	// ObjectName/Attribute=value
 	// ObjectName/Attribute[item]=value
 	// ObjectName/Attribute=value,value,value,...,value
 	// Where "ObjectName" may be an XPath-like expression
 	var attrNdx = 0;
    var valueNdx = 0;
    var rangeNdx = 0;
    var itemNdx = 0;

    var triggerString = "";
    triggerString = trigger.getValueDirect().join("");
 	attrNdx = triggerString.lastIndexOf('/');

 	if (attrNdx != -1)
 	{
 		var objectName = triggerString.substring(0, attrNdx);
 		var resource = bridgeworks.registry.find(objectName);
 		if(resource)
 		{
 			var not = false;

            var attrName = "";
            var itemString = "";
            var valueString = "";
            var rangeString = "";
            
 			valueNdx = triggerString.lastIndexOf('!');
 			if (valueNdx > 0)
 			{
 			    triggerString.replace("!", ""); // erase the '!' for subsequent processing
 			    not = true;
 			}

 			valueNdx = triggerString.lastIndexOf('=');

 			if(valueNdx > 0) 
 			{
 				itemNdx = triggerString.lastIndexOf('[');
 				if(itemNdx > 0) 
 				{
 					var itemNdx2 = triggerString.lastIndexOf(']', itemNdx); 
 					itemString = triggerString.substring(itemNdx+1, itemNdx2 - itemNdx - 1); 
 				}

 				var range = FLT_MAX; 
 				var rangeNdx = triggerString.lastIndexOf(',');
 				if(rangeNdx > 0)
 				{
 					var rangeString = triggerString.substring(rangeNdx+1, trigger.length()-rangeNdx-1);
 					range = rangeString.parseFloat(); 
 				}
 				rangeNdx = rangeNdx == -1 ? triggerString.length : rangeNdx;
 				// value is the string between '=' && (',' || end of string)
 				valueString = triggerString.substring(valueNdx+1, valueNdx+(rangeNdx-valueNdx));

 			}
 			else //TEMPEST
 			{
 				itemNdx = triggerString.lastIndexOf('[');
 				if(itemNdx > 0) 
 				{
 					var itemNdx2 = triggerString.lastIndexOf(']', itemNdx);
 					itemString = triggerString.substring(itemNdx+1, itemNdx2-itemNdx-1);
 				}
 			}
 			valueNdx = itemNdx == -1 ? (valueNdx == -1 ? triggerString.length() : valueNdx) : itemNdx;
 			attrName = triggerString.substring(attrNdx+1, valueNdx);

 			var input = resource.getAttribute(attrName);

 			var attr = this.createAttribute(input, valueString);

 			if(attr)
 			{
 				var item = -1; 
 				if(itemString != "")
 				{
 					item = parseInt(itemString);
 				}

 				var numExecutions = command.numResponses;
 				var newTrigger = new AttributeTrigger(input, attr, command, item, not, numExecutions);

 				command.setTrigger(newTrigger);
 			}
 			triggerString = objectName + "/" + attrName;

 			console.debug(trigger);
 			console.debug("\n");
 		}		
 	}
 }

CommandMgr.prototype.createAttribute = function(attribute, value)
{
	var newAttribute = null;
	if(attribute)
	{
        //console.debug(attribute);
		var etype = attribute.attrType;
		var len = attribute.getLength();
        //console.debug(etype);
//			switch (etype)
//			{
//
//			case eAttrType.BooleanAttr:
//				{
//					newAttribute = new NumberAttr();
//		            newAttribute.setValueDirect(parseInt(value));
//				}
//				break;
//            case eAttrType.NumberAttr:
//
//				{
					newAttribute = new NumberAttr();
		            newAttribute.setValueDirect(parseFloat(value));
//				}
//				break;
//
//            case eAttrType.StringAttr:
//				{
//					newAttribute = new StringAttr();
//                    newAttribute.setValueDirect(value);
//				}
//				break;
//
//			default:
//				newAttribute = null;
//				break;
//			}
		  }
        //console.debug(newAttribute);
		return newAttribute; 
}

function CommandMgr_CommandTriggerModifiedCB(attribute, container)
{
	this.createCommandTrigger(attribute, container);
}

AttributeTrigger.prototype = new Command();
AttributeTrigger.prototype.constructor = AttributeTrigger;


function AttributeTrigger(input, trigger, target, item, _not, _executionCount)
{
    this.input = input;
    this.trigger = trigger;
    this.target = target;

    this.lastValues = [];

	this.input.getValue(this.lastValues);
    this.attrType = eAttrType.AttributeTrigger;
	
    this.item = item;
    
    this.not = _not;


    this.executionCount = _executionCount;

	this.input.addModifiedCB(AttributeTrigger_InputModifiedCB, this);

	var len = this.input.getLength();

	if (len == 1)
	{
		this.item = 0;
	}
}


AttributeTrigger.prototype.execute = function()
{
	if (this.target)
	{
        var type = this.trigger.attrType;

        switch (type)
        {

        case eAttrType.StringAttr:
            {
                var vIn = [];
                var vTrig = [];
            
                this.input.getValue(vIn);
                this.trigger.getValue(vTrig);

                var pass = vIn[0] == vTrig[0] ? true : false;
                pass = this.not ? !pass : pass;
                if (pass)
                {
                    var count = this.executionCount.getValueDirect() - 1;
                    this.executionCount.setValueDirect(count);
                }

                if (this.executionCount == 0)
		        {
			        this.target = null;
		        }
            }
            break;

        default:
            {
                var vIn = [];
                var vTrig = [];

		        this.input.getValue(vIn);
		        this.trigger.getValue(vTrig);

		        // match single-item Attribute OR single item of a multi-item Attribute
		        if (this.item != -1)
		        {
			        // if equal OR descending past OR ascending past
                    var pass = ((vIn[this.item] == vTrig[0]) ||
			                     (this.lastValues[this.item] > vIn[this.item] && vIn[this.item] < vTrig[0]) ||
			                     (this.lastValues[this.item] < vIn[this.item] && vIn[this.item] > vTrig[0]));
                    pass = this.not ? !pass : pass;
                    if (pass)
			        {
						this.target.execute();
                        var count = this.executionCount.getValueDirect() - 1;
				        this.executionCount.setValueDirect(count);
			        }
		        }
		        else	// match every item in a multi-item Attribute
		        {
			        var len = this.input.getLength();
			        var matches = 0;
			        for (var i = 0; i < len; ++i)
			        {
				        // if equal OR descending past OR ascending past
				        var pass = ((vIn[i] == vTrig[i]) ||
				                     (this.lastValues[i] > vIn[i] && vIn[i] < vTrig[i]) ||
				                     (this.lastValues[i] < vIn[i] && vIn[i] > vTrig[i]));
                        pass = this.not ? !pass : pass;
                        if (pass)
				        {
					        ++matches;
				        }
			        }

			        // if every item matches simultaneously
			        if (matches = len)
			        {
						err = this.target.execute();
						this.executionCount.setValueDirect(--this.executionCount);
			        }
		        }

		        if (this.executionCount.getValueDirect() == 0)
		        {
			        this.target = null;
                    this.input.removeModifiedCB(AttributeTrigger_InputModifiedCB,this);
		        }
		        else
		        {
			        this.lastValues = vIn;
		        }
            }
            break;
        }
	}

	return;
}

function AttributeTrigger_InputModifiedCB(attribute, container)
{
	container.execute();

	// TODO:  Expand to also support EventListener::EventPerformed
}
/*
void AttributeTrigger_InputModifiedTaskProc(void* data, const bool & run)
{
	TAttributeTrigger* pTrigger = static_cast<TAttributeTrigger*>(data);
	pTrigger.Execute();
}
*/
BwRegistry.prototype = new AttributeRegistry();
BwRegistry.prototype.constructor = BwRegistry;

function BwRegistry()
{
    AttributeRegistry.call(this);
    this.className = "BwRegistry";
    this.attrType = eAttrType.AttributeRegistry;
    
    this.rootPtr = new ReferenceAttr(null);
    this.subtreePtr = new ReferenceAttr(null);
    this.sgPointer = new StringAttr("");
    this.maxAnimationTimeInSecs = new NumberAttr(0);

    this.rootPtr.addModifiedCB(BwRegistry_RootPtrModifiedCB, this);
    this.sgPointer.addModifiedCB(BwRegistry_SgPointerModifiedCB, this);
    
    this.registerAttribute(this.rootPtr, "rootPtr");
    this.registerAttribute(this.subtreePtr, "subtreePtr");
    this.registerAttribute(this.sgPointer, "sgPointer");
    this.registerAttribute(this.maxAnimationTimeInSecs, "maxAnimationTimeInSecs");
    
    this.registerByName(this, "NodeMgr");      // backward-compatibility
    this.registerByName(this, "EvaluatorMgr"); // backward-compatibility
}

BwRegistry.prototype.find = function(name)
{
    if (!name) return null;
    
    // tokenize name path
    var tokens = [];
    var index = 0;
    while ((index = name.indexOf('/')) > -1)
    {
        tokens.push(name.substring(0, index));
        name = name.substring(index+1, name.length);
    }
    tokens.push(name);
    
    // call get() on first token
    var resource = this.getByName(tokens[0]);
    if (resource) resource = resource[0];
    
    // call getAttribute() on subsequent tokens
    for (var i=1; i < tokens.length && resource; i++)
    {
        resource = resource.getAttribute(tokens[i]);
    }
    
    return resource;
}

BwRegistry.prototype.findContext = function(name, context)
{
    // TODO
}

BwRegistry.prototype.registerResource = function(container)
{
    // setup parent relationship for nodes (not all containers passed to this method will be nodes)
    if (container.isNode() && container.getAttribute("orphan").getValueDirect() == false)
    {
        this.updateTree(container);
    }
}

BwRegistry.prototype.finalizeResource = function(container)
{
    if (container.isNode() && container.getParentCount() > 0)
    {
        this.subtreePtr.setValueDirect(container.getParent(0));
    }
}

BwRegistry.prototype.register = function(container)
{
    // call base-class implementation
    AttributeRegistry.prototype.register.call(this, container);
    
    // TODO
}

BwRegistry.prototype.unregister = function(container)
{
    // call base-class implementation
    AttributeRegistry.prototype.unregister.call(this, container);
    
    // TODO
}

BwRegistry.prototype.clear = function()
{
    this.rootPtr.setValueDirect(null);
    this.subtreePtr.setValueDirect(null);
    this.sgPointer.setValueDirect(null);
    
    // call base-class implementation
    AttributeRegistry.prototype.clear.call(this);    
}

BwRegistry.prototype.updateTree = function(node)
{
    var root = this.rootPtr.getValueDirect();
    var subtree = this.subtreePtr.getValueDirect();
  
    // by default, first node is the root
    if (root == null)
    {
        root = subtree = node;
    }
    else
    {
        if (subtree)
        {
            subtree.addChild(node);
        }
        else
        {
            root.addChild(node);
        }
        
        subtree = node;
    }
    
    this.rootPtr.setValueDirect(root);
    this.subtreePtr.setValueDirect(subtree);
}

BwRegistry.prototype.updateMaxAnimationTime = function()
{
    // TODO
}

BwRegistry.prototype.formatContext = function(attribute, name)
{
    // TODO
}

BwRegistry.prototype.sgPointerModified = function()
{
    var resource = this.find(this.sgPointer.getValueDirect().join(""));
    if (resource)
    {
        this.subtreePtr.setValueDirect(resource);
    }
}

function BwRegistry_RootPtrModifiedCB(attribute, container)
{
    var resource = attribute.getValueDirect();
}

function BwRegistry_SgPointerModifiedCB(attribute, container)
{
    container.sgPointerModified();
}
BwSceneInspector.prototype = new SceneInspector();
BwSceneInspector.prototype.constructor = BwSceneInspector;

function BwSceneInspector()
{
    SceneInspector.call(this);
    this.className = "BwSceneInspector";
    this.attrType = eAttrType.SceneInspector;
    
    this.camera = null;
    this.viewport = new Viewport();
    this.worldUnitsPerPixel = new Vector2D();
    this.clickPosWorld = new Vector3D();
    this.last_d3 = 0;
    
    this.translationSensitivity = new Vector3DAttr(1, 1, 1);
    this.panSensitivity = new Vector3DAttr(1, 1, 1);
    this.trackSensitivity = new Vector3DAttr(1, 1, 1);
    this.rotationSensitivity = new Vector3DAttr(1, 1, 1);
    this.zoomSensitivity = new NumberAttr(1);
    this.invertedTranslationDelta = new Vector3DAttr(0, 0, 0);
    this.invertedPanDelta = new Vector3DAttr(0, 0, 0);
    this.invertedTrackDelta = new Vector3DAttr(0, 0, 0);
    this.invertedRotationDelta = new Vector3DAttr(0, 0, 0);
    this.zoomDelta = new NumberAttr(0);
    this.invertedZoomDelta = new NumberAttr(0);
    this.selectionOccurred = new BooleanAttr(false);
    this.viewRelativeTranslationDelta = new Vector3DAttr(0, 0, 0);
    
    this.translationDelta.addModifiedCB(BwSceneInspector_TranslationDeltaModifiedCB, this);
    this.panDelta.addModifiedCB(BwSceneInspector_PanDeltaModifiedCB, this);
    this.trackDelta.addModifiedCB(BwSceneInspector_TrackDeltaModifiedCB, this);
    this.rotationDelta.addModifiedCB(BwSceneInspector_RotationDeltaModifiedCB, this);
    this.invertedTranslationDelta.addModifiedCB(BwSceneInspector_InvertedTranslationDeltaModifiedCB, this);
    this.invertedPanDelta.addModifiedCB(BwSceneInspector_InvertedPanDeltaModifiedCB, this);
    this.invertedTrackDelta.addModifiedCB(BwSceneInspector_InvertedTrackDeltaModifiedCB, this);
    this.invertedRotationDelta.addModifiedCB(BwSceneInspector_InvertedRotationDeltaModifiedCB, this);
    this.zoomDelta.addModifiedCB(BwSceneInspector_ZoomDeltaModifiedCB, this);
    this.invertedZoomDelta.addModifiedCB(BwSceneInspector_InvertedZoomDeltaModifiedCB, this);
    this.selectionOccurred.addModifiedCB(BwSceneInspector_SelectionOccurredCB, this);
    this.viewRelativeTranslationDelta.addModifiedCB(BwSceneInspector_TrackDeltaModifiedCB, this);
    
    this.registerAttribute(this.translationSensitivity, "translationSensitivity");
    this.registerAttribute(this.panSensitivity, "panSensitivity");
    this.registerAttribute(this.trackSensitivity, "trackSensitivity");
    this.registerAttribute(this.rotationSensitivity, "rotationSensitivity");
    this.registerAttribute(this.zoomSensitivity, "zoomSensitivity");
    this.registerAttribute(this.invertedTranslationDelta, "invertedTranslationDelta");
    this.registerAttribute(this.invertedPanDelta, "invertedPanDelta");
    this.registerAttribute(this.invertedTrackDelta, "invertedTrackDelta");
    this.registerAttribute(this.invertedRotationDelta, "invertedRotationDelta");
    this.registerAttribute(this.zoomDelta, "zoomDelta");
    this.registerAttribute(this.invertedZoomDelta, "invertedZoomDelta");
    this.registerAttribute(this.selectionOccurred, "selectionOccurred");
    this.registerAttribute(this.viewRelativeTranslationDelta, "viewRelativeTranslationDelta");
    
    // set orphan so that evaluator will not be added to scene graph
	this.orphan.setValueDirect(true);
}

BwSceneInspector.prototype.evaluate = function()
{
    // call base-class implementation
    SceneInspector.prototype.evaluate.call(this);
}

BwSceneInspector.prototype.translate = function(delta)
{
    if (delta.x == 0 && delta.y == 0 && delta.z == 0)
    {
        // no effect
        return;
    }
    
    // get sensitivity
    var sensitivity = this.translationSensitivity.getValueDirect();

    // calculate deltas (scale by sensitivity)
    delta.x *= sensitivity.x;
    delta.y *= sensitivity.y;
    delta.z *= sensitivity.z;

    // set deltas
    var values = [delta.x, delta.y, delta.z];
    var params = new AttributeSetParams(-1, -1, 0, true, false);
	this.translationDelta.setValue(values, params);
	
    // evaluate scene inspector
	this.evaluate();

    // clear deltas
    var zeroes = [0, 0, 0];
    this.translationDelta.setValue(zeroes, params);
    this.invertedTranslationDelta.setValue(zeroes, params);
}

BwSceneInspector.prototype.pan = function(delta)
{
    if (delta.x == 0 && delta.y == 0 && delta.z == 0)
    {
        // no effect
        return;
    }
    
    // if worldUnitsPerPixel hasn't been set, use pivot distance as default
    if (this.worldUnitsPerPixel.x == 0 && this.worldUnitsPerPixel.y == 0)
    {
        var wupp = this.getWorldUnitsPerPixel(this.pivotDistance.getValueDirect());
        this.worldUnitsPerPixel.x = wupp.x;
        this.worldUnitsPerPixel.y = wupp.y;
    }
    
    // get sensitivity
    var sensitivity = this.panSensitivity.getValueDirect();

    // calculate deltas (scale by sensitivity & worldUnitsPerPixel)
    delta.x *= sensitivity.x * this.worldUnitsPerPixel.x;
    delta.y *= sensitivity.y * this.worldUnitsPerPixel.y;
    delta.z *= sensitivity.z * this.worldUnitsPerPixel.y; // use y for z
    
    // set deltas
    var values = [delta.x, delta.y, delta.z];
    var params = new AttributeSetParams(-1, -1, 0, true, false);
	this.panDelta.setValue(values, params);
	
	// update pivot distance if panning in z-direction
	if (delta.z != 0)
	{
	    var pivotDistance = this.pivotDistance.getValueDirect();
	    pivotDistance -= delta.z;
	    this.pivotDistance.setValueDirect(pivotDistance);
	}
	
    // evaluate scene inspector
	this.evaluate();

    // clear deltas
    var zeroes = [0, 0, 0];
    this.panDelta.setValue(zeroes, params);
    this.invertedPanDelta.setValue(zeroes, params);
}

BwSceneInspector.prototype.track = function(delta)
{   
    if (delta.x == 0 && delta.y == 0 && delta.z == 0)
    {
        // no effect
        return;
    }

    // not supported for orthographic cameras
    if (this.camera == null || this.camera.attrType == eAttrType.OrthographicCamera)
    {
        return;
    }

	// check for valid viewport
	if (this.viewport.width <= 0 || this.viewport.height <= 0)
	{
		return;
	}

    // if worldUnitsPerPixel hasn't been set, use pivot distance as default
    if (this.worldUnitsPerPixel.x == 0 && this.worldUnitsPerPixel.y == 0)
    {
        var wupp = this.getWorldUnitsPerPixel(this.pivotDistance.getValueDirect());
        this.worldUnitsPerPixel.x = wupp.x;
        this.worldUnitsPerPixel.y = wupp.y;
    }

    // get sensitivity
    var sensitivity = this.trackSensitivity.getValueDirect();

    // calculate x and y deltas (scale by sensitivity & worldUnitsPerPixel)
    // calculate deltas (scale by sensitivity & worldUnitsPerPixel)
    delta.x *= sensitivity.x * this.worldUnitsPerPixel.x;
    delta.y *= sensitivity.y * this.worldUnitsPerPixel.y;
    
    // calculate z delta (scale by sensitivity)
    if (delta.z != 0)
    {
        // Let cameraPos be the sector position of the camera
		var cameraPos = this.camera.getAttribute("position").getValueDirect();

        // Let cameraRot be the world-space rotation of the camera
        var cameraRot = this.camera.getAttribute("rotation").getValueDirect();
    
        // Let cameraHeight be the delta between the clickPosWorld.y and cameraPos.y
        var cameraHeight = cameraPos.y - this.clickPosWorld.y;
        
        // STEP 2: define d1 as the distance between cameraPos and clickPosWorld
        var d1 = distanceBetween(cameraPos, this.clickPosWorld);

        // STEP 3: using the pythagorean theorem, a^2 + b^2 = c^2, where a = cameraHeight, 
        //         b = unknown, and c = d1, find the length b1 of side b
        var b1 = Math.sqrt((d1 * d1) - (cameraHeight * cameraHeight));

        // calculate distance between camera and new point
        var zoom = this.camera.getAttribute("zoom").getValueDirect();
        var fovy = 2 * Math.atan2(1, zoom);
        var radsPerPixel = fovy / this.viewport.height;
        var angleB_Radians = Math.acos(cameraHeight / d1);
        var angleA_Radians = angleB_Radians + (delta.z * radsPerPixel);
        var b2 = Math.tan(angleA_Radians) * cameraHeight;

        // STEP 7: define d3 as b2 - b1
        var d3 = b2 - b1;

        // as angle B approaches 90, use last calculated d3 (algorithm produces exponential results otherwise) 
        if (angleB_Radians >= toRadians(88) && angleB_Radians <= toRadians(92))
        {
            if (d3 < 0)
            {
                d3 = -(Math.abs(this.last_d3));
            }
            else
            {
                d3 = Math.abs(this.last_d3);
            }
        }

        var viewRotation = cameraRot;
        var fabs_bank = Math.abs(cameraRot.z);
        var flipIt = false;
        if (fabs_bank >= 90 && fabs_bank <= 270)
        {
            if (cameraRot.x > -45 && cameraRot.x < 45)
            {
                flipIt = true;
            }
        }
        if (flipIt)
        {
            d3 = -d3;
        }

        this.last_d3 = d3;

        // STEP 8: translate camera by d3 units
		delta.z = d3 * sensitivity.z * (cameraHeight < 0 ? -1 : 1);

        //var mat = new Matrix4x4();
        //mat.loadYAxisRotation(cameraRot.y);
        //var v = mat.transform(0, 0, 1, 0);
        //v.normalize();
        
        var directions = this.camera.getDirectionVectors();
        v = new Vector3D(directions.forward.x, directions.forward.y, directions.forward.z);
        v.y = 0;
        v.normalize();

        // method 1 for retrieval of angle C
        var camToClick = subtract3D(this.clickPosWorld, cameraPos);
        camToClick.y = 0;
        camToClick.normalize();
        var cosAngleBetweenCameraDirectionAndCamToClick = cosineAngleBetween(camToClick, v);
        var headingRads = Math.acos(cosAngleBetweenCameraDirectionAndCamToClick);
    
        // method 2 for retrieval of angle C
        var fovx = 2 * Math.atan(this.viewport.width / this.viewport.height * Math.tan(fovy / 2));
        var radsPerPixelX = fovx / this.viewport.width;
        var clickPoint;
        var selector = this.registry.find("Selector");
        if (selector)
        {
            clickPoint = selector.getAttribute("clickPoint").getValueDirect();
        }
        var angleC_Radians = Math.abs(this.viewport.width / 2 - clickPoint.x) * radsPerPixelX;
        headingRads = angleC_Radians;
    
        var xTrans = Math.tan(headingRads) * d3;

        var plane = new Plane(cameraPos, directions.right);
        if (pointOnNegativeSideOfPlane(this.clickPosWorld, plane))
        {
            xTrans *= -1;
        }
        if (flipIt)
        {
            xTrans *= -1;
        }

        delta.x += -xTrans;
    }
    
    // set deltas
    var values = [delta.x, delta.y, delta.z];
    var params = new AttributeSetParams(-1, -1, 0, true, false);
	this.trackDelta.setValue(values, params);
	
	// evaluate scene inspector
	this.evaluate();

    // clear deltas
    var zeroes = [0, 0, 0];
    this.trackDelta.setValue(zeroes, params);
    this.invertedTrackDelta.setValue(zeroes, params);
}

BwSceneInspector.prototype.rotate = function(delta)
{
    if (delta.x == 0 && delta.y == 0 && delta.z == 0)
    {
        // no effect
        return;
    }

    // get sensitivity
    var sensitivity = this.rotationSensitivity.getValueDirect();

    // calculate deltas (scale by sensitivity)
    delta.x *= sensitivity.x;
    delta.y *= sensitivity.y;
    delta.z *= sensitivity.z;

    // set deltas
    var values = [delta.x, delta.y, delta.z];
    var params = new AttributeSetParams(-1, -1, 0, true, false);
	this.rotationDelta.setValue(values, params);
	
    // evaluate scene inspector
	this.evaluate();

    // clear deltas
    var zeroes = [0, 0, 0];
    this.rotationDelta.setValue(zeroes, params);
    this.invertedRotationDelta.setValue(zeroes, params);
}

BwSceneInspector.prototype.zoom = function(delta)
{
    if (delta == 0)
    {
        // no effect
        return;
    }
    
    if (!this.camera)
    {
        return;
    }
    
    switch (this.camera.className)
    {
    case "PerspectiveCamera":
        {
            var zoom = this.camera.getAttribute("zoom").getValueDirect();
            zoom += delta * this.zoomSensitivity.getValueDirect();
            if (zoom < 0) zoom = 0.05; // don't go < 0
            this.camera.getAttribute("zoom").setValueDirect(zoom);
        }
        break;
        
    case "OrthographicCamera":
        {
            var width = this.camera.getAttribute("width").getValueDirect();
            width += delta * this.zoomSensitivity.getValueDirect();
            if (width < 0) width = 0; // don't go < 0
            this.camera.getAttribute("width").setValueDirect(width);
        }
        break;
    }
}

BwSceneInspector.prototype.setCamera = function(camera)
{
    this.camera = camera;
}

BwSceneInspector.prototype.getCamera = function()
{
    return this.camera;
}

BwSceneInspector.prototype.getWorldUnitsPerPixel = function(viewSpace_Z)
{
    var x = 0;
    var y = 0;
    
    // get current viewport
    var selector = this.registry.find("Selector");
    if (selector)
    {
        var vp = selector.selections.viewports[selector.selections.viewports.length-1];
        
        if (this.camera)
        {
            switch (this.camera.attrType)
            {
            case eAttrType.PerspectiveCamera:
                {
                    // get zoom
				    var zoom = this.camera.getAttribute("zoom").getValueDirect();

				    // determine the per-pixel width and height at viewSpace_Z
				    var result = worldUnitsPerPixelPersp(vp, zoom, viewSpace_Z);
				    x = result.x;
				    y = result.y;    
                }
                break;
                
            case eAttrType.OrthographicCamera:
                {
                    // get width
				    var width = this.camera.getAttribute("width").getValueDirect();

				    // determine the per-pixel width and height
				    var result = worldUnitsPerPixelOrtho(vp, width);
				    x = result.x;
				    y = result.y;
                }
                break;
            }
        }
    }
    
    return { x: x, y: y };
}

function BwSceneInspector_TranslationDeltaModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        container.translate(attribute.getValueDirect());
    }
}
    
function BwSceneInspector_PanDeltaModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        container.pan(attribute.getValueDirect());
    }
}

function BwSceneInspector_TrackDeltaModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        container.track(attribute.getValueDirect());
    }
}

function BwSceneInspector_RotationDeltaModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        container.rotate(attribute.getValueDirect());
    }
}

function BwSceneInspector_InvertedTranslationDeltaModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        var deltas = attribute.getValueDirect();
        deltas.x *= -1;
        deltas.y *= -1;
        deltas.z *= -1;
        container.translate(deltas);
        
        if (deltas.x != 0 || deltas.y != 0 || deltas.z != 0) alert("rotate");
    }
}
 
function BwSceneInspector_InvertedPanDeltaModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        var deltas = attribute.getValueDirect();
        deltas.x *= -1;
        deltas.y *= -1;
        deltas.z *= -1;
        container.pan(deltas);
    }
}

function BwSceneInspector_InvertedTrackDeltaModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        var deltas = attribute.getValueDirect();
        deltas.x *= -1;
        deltas.y *= -1;
        deltas.z *= -1;
        container.track(deltas);
    }
}

function BwSceneInspector_InvertedRotationDeltaModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        var deltas = attribute.getValueDirect();
        deltas.x *= -1;
        deltas.y *= -1;
        deltas.z *= -1;
        container.rotate(deltas);
    }
}

function BwSceneInspector_ZoomDeltaModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        container.zoom(attribute.getValueDirect());
    }
}

function BwSceneInspector_InvertedZoomDeltaModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        container.zoom(attribute.getValueDirect() * -1);
    }
}

function BwSceneInspector_SelectionOccurredCB(attribute, container)
{
    var selector = container.registry.find("Selector");
    if (selector)
    {
        // get viewport
        if (selector.selections.viewports.length > 0)
        {
            container.viewport.loadViewport(selector.selections.viewports[0]);
        }
        
        // get click point in world-space
        container.clickPosWorld.copy(selector.getAttribute("pointWorld").getValueDirect());
        
        // get click point in view-space
        var clickPosView = selector.getAttribute("pointView").getValueDirect();
        
        // get world units per-pixel at click point z
        container.getWorldUnitsPerPixel(clickPosView.z);
    }
}



ObjectInspector.prototype = new ArcballInspector();
ObjectInspector.prototype.constructor = ObjectInspector;

function ObjectInspector()
{
    ArcballInspector.call(this);
    this.className = "ObjectInspector";
    this.attrType = eAttrType.ObjectInspector;
    
    this.camera = null;
    this.selectedObjects = [];
    this.pointView = new Vector3DAttr(1, 1, 1);
    this.translationDelta = new Vector3DAttr(0, 0, 0);
    this.rotationDelta = new Vector3DAttr(0, 0, 0);
    this.translationNow = new Vector3DAttr(0, 0, 0);
    this.rotationNow = new Vector3DAttr(0, 0, 0);
    this.selectionOccurred = new BooleanAttr(false);
    this.selectionCleared = new BooleanAttr(false);
    
    this.translationDelta.addModifiedCB(ObjectInspector_TranslationDeltaModifiedCB, this);
    this.rotationDelta.addModifiedCB(ObjectInspector_RotationDeltaModifiedCB, this);
    this.translationNow.addModifiedCB(ObjectInspector_TranslationNowModifiedCB, this);
    this.rotationNow.addModifiedCB(ObjectInspector_RotationNowModifiedCB, this);
    this.selectionOccurred.addModifiedCB(ObjectInspector_SelectionOccurredCB, this);
    this.selectionCleared.addModifiedCB(ObjectInspector_SelectionClearedCB, this);
    
    this.registerAttribute(this.pointView, "pointView");
    this.registerAttribute(this.translationDelta, "translationDelta");
    this.registerAttribute(this.rotationDelta, "rotationDelta");    
    this.registerAttribute(this.translationNow, "translationNow");    
    this.registerAttribute(this.rotationNow, "rotationNow");    
    this.registerAttribute(this.selectionOccurred, "selectionOccurred");
    this.registerAttribute(this.selectionCleared, "selectionCleared");
    
    // set orphan so that evaluator will not be added to scene graph
    this.orphan.setValueDirect(true);   
    
    this.enabled.addModifiedCB(ObjectInspector_EnableModifiedCB, this)   
}

function ObjectInspector_EnableModifiedCB(attribute, container)
{
    console.debug("ObjectInspector.enable modified: " + container.enabled.getValueDirect().toString())
}

ObjectInspector.prototype.applyCameraRelativeRotation = function(selected)
{
    var i;
	
    // vectors
    var pivot  = null;
    var screen = null;
	
    // matrices
    var camXform  = null;
    var proj  = null;
    var world = null;
    
    // viewport
    var vp = this.viewport;

    // convenience
    var cam = this.camera;

    // sphere center (use world position of selected node)
    pivot = selected.worldCenter.getValueDirect();

    camXform = cam.getTransform();
    camXform.invert(); // put in view-space
    
    projection = cam.projectionMatrix;

    screen = toScreenSpace(pivot, camXform, projection, vp);
	
    this.sphereCenter.setValueDirect(screen.x, screen.y, 0);

    // sphere radius
    this.sphereRadius.setValueDirect(0.75);

    // world transform
    world = selected.getTransform();
    
    this.worldTransform.setValueDirect(world);

    // view transform
    camXform = cam.getTransform();
	
    this.viewTransform.setValueDirect(camXform);
    
    //var sPos = this.viewTransform.getValueDirect();
    //console.debug("ObjectInspector.viewTransform: " + sPos._11 + ", " + 
    //    sPos._12 + ", " + sPos._13);
}

ObjectInspector.prototype.applyCameraRelativeTranslation = function(selected)
{
    var cam = this.camera;

    // get translation delta values
    var delta = this.translationDelta.getValueDirect();
	
    if (delta.x == 0 && delta.y == 0 && delta.z == 0) 
    {
        return;
    }

    // get sector view matrix
    var camSectorXform = cam.getSectorTransform();
    camSectorXform.invert(); // put in view-space

    // get node, camera world positions
    var nodePos = selected.sectorWorldCenter.getValueDirect();
    var camPos  = cam.sectorWorldPosition.getValueDirect();

    // calculate forward vector as vector from camera world position to node world position
    var fwd = new Vector3D(nodePos.x - camPos.x, 
                           nodePos.y - camPos.y,
                           nodePos.z - camPos.z);
    fwd.normalize();

    // get viewport dimensions
    var vp = this.viewport;

    // get click point in camera space
    var v = this.pointView.getValueDirect();
    var clickPtCamSpace = new Vector3D(v.x, v.y, v.z);

    var transDelta = null;
    
    var xTransCamSpace = new Vector3D(1, 0, 0);
    var yTransCamSpace = new Vector3D(0, 1, 0);
    var zTransWorldSpace = new Vector3D(fwd.x, fwd.y, fwd.z);
    
    var destCamSpace = new Vector3D(v.x, v.y, v.z);
    
    var parent = selected.motionParent;
    var mParent = null;
    if (parent) 
    {
        mParent = parent.getTransform();
        mParent.invert();
    }
    
    var perPixelWidth = -1;
    var zoom_or_width = -1;
    
    switch (cam.attrType)
    {
        case eAttrType.PerspectiveCamera:
        {
            // get zoom
            zoom_or_width = cam.zoom.getValueDirect();

            // determine the per-pixel width and height at clickPtCamSpace.z
            perPixelWidth = worldUnitsPerPixelPersp(vp, zoom_or_width, clickPtCamSpace.z);
        }
        break;

        case eAttrType.OrthographicCamera:
        {
            // get width
            zoom_or_width = cam.width.getValueDirect();

            // determine the per-pixel width and height
            perPixelWidth = worldUnitsPerPixelOrtho(vp, zoom_or_width);

        }
        break;

        default:
            break;
    }
    
    // multiply the per-pixel width by delta.x and use this to scale the
    // camera-space vector (1, 0, 0)
    xTransCamSpace.multiplyScalar(perPixelWidth.x);
    xTransCamSpace.multiplyScalar(-delta.x);

    // multiply the per-pixel height by delta.y and use this to scale the
    // camera-space vector (0, 1, 0)
    yTransCamSpace.multiplyScalar(perPixelWidth.y);
    yTransCamSpace.multiplyScalar(delta.y);

    // multiply the per-pixel height by delta.z and use this to scale the
    // world-space forward vector
    zTransWorldSpace.multiplyScalar(perPixelWidth.y);
    zTransWorldSpace.multiplyScalar(delta.z);

    // calculate camera-space destination point as camera-space click point
    // plus xTransCamSpace and yTransCamSpace
    destCamSpace.addVector(xTransCamSpace);
    destCamSpace.addVector(yTransCamSpace);

    // convert clickPtCamSpace and destCamSpace to world space
    camSectorXform.invert();
    // if parented, multipy view with parent's inverse
    if (mParent)
    {
        camSectorXform = camSectorXform.multiply(mParent);
        zTransWorldSpace = mParent.transform(zTransWorldSpace.x, zTransWorldSpace.y, zTransWorldSpace.z, 0);
    }
    clickPtCamSpace = camSectorXform.transform(clickPtCamSpace.x, clickPtCamSpace.y, clickPtCamSpace.z, 1);
    destCamSpace = camSectorXform.transform(destCamSpace.x, destCamSpace.y, destCamSpace.z, 1);
    
    // calculate the translation delta as destCamSpace - clickPtCamSpace + zTransWorldSpace
    transDelta = new Vector3D(destCamSpace.x, destCamSpace.y, destCamSpace.z);
    transDelta.subtractVector(clickPtCamSpace);
    transDelta.addVector(zTransWorldSpace);

    // add scaled direction vectors to current node position
    var attrSetParams = new AttributeSetParams(-1, -1, eAttrSetOp.Add, true, true);
    var attrSetVals = [transDelta.x, transDelta.y, transDelta.z];
    selected.sectorPosition.setValue(attrSetVals, attrSetParams);

    var sPos = selected.sectorPosition.getValueDirect();
    console.debug("selected.sectorPosition: " + sPos.x + ", " + 
        sPos.y + ", " + sPos.z);
}

ObjectInspector.prototype.translationDeltaModified = function()
{
    var pme = null;
    for (var i=0; i < this.selectedObjects.length; i++)
    {
        pme = this.selectedObjects[i];
        if (!pme)
        {
            continue;
        }

        var moveable = pme.getAttribute("moveable").getValueDirect();
        if (!moveable)
        {
            continue;
        }

        this.applyCameraRelativeTranslation(pme);
    }

    var zeroes = [0, 0, 0];
    var params = new AttributeSetParams(0,0,0, true, false);

    this.translationDelta.setValue(zeroes, params);  
}

ObjectInspector.prototype.rotationDeltaModified = function()
{
    var pme = null;
    for (var i=0; i < this.selectedObjects.length; i++)
    {
        pme = this.selectedObjects[i];
        if (!pme)
        {
            continue;
        }

        var moveable = pme.moveable.getValueDirect();
        if (!moveable)
        {
            continue;
        }

        this.applyCameraRelativeRotation(pme);

        var mNow = this.mouseNow.getValueDirect();
        var rDelta = this.rotationDelta.getValueDirect();

        mNow.x -= rDelta.x;
        mNow.y -= rDelta.y;

        // mouse now (formulate so that mouse coords match windows standard
        // of (0, 0) at top-left, and (width, height) at bottom-right)
        this.mouseNow.setValueDirect(mNow.y, mNow.x);

        this.evaluate();
    }
}

ObjectInspector.prototype.rotationNowModified = function()
{
    if (this.selectedObjects == null ||
        this.selectedObjects == undefined)
        return;
    
    var pme = null;
    for (var i=0; i < this.selectedObjects.length; i++)
    {
        pme = this.selectedObjects[i];
		
        var moveable = pme.moveable.getValueDirect();
        if (moveable)
        {

            this.applyCameraRelativeRotation(pme);
            
            var rNow = this.rotationNow.getValueDirect();
            
            // mouse now (formulate so that mouse coords match windows standard
            // of (0, 0) at top-left, and (width, height) at bottom-right)
            this.mouseNow.setValueDirect(rNow.y, rNow.x);
            
            //console.debug("mouseNow: " + rNow.x + ", " + 
            //    rNow.y);
    
            this.evaluate();
        }
    }
}

ObjectInspector.prototype.runSelectionOccurred = function()
{
    var selector =  this.registry.find("Selector");
    var vpMgr = this.registry.find("ViewportMgr");

    //this.registryThreadLock.Unlock();
    if (!selector || !vpMgr)
    {
        return;
    }

    // get selector click point
    // must use getAttribute here b/c it's not a native attribute to Selector
    var clickPoint = selector.getAttribute("clickPoint").getValueDirect();

    // get viewport and camera into view object
    var view = vpMgr.getViewportAtScreenXY(clickPoint.x, clickPoint.y);
    this.viewport = view.viewport;
    this.camera = view.camera;
	
    // get selected movable objects
    // TODO: don't assume models?
    this.selectedObjects = selector.selections.models.slice();

    var pResultQuat = this.resultQuat;
    var pQuatAtMouseDown = this.quatAtMouseDown;
    var pMouseDown = this.mouseDown;
    var pMouseNow = this.mouseNow;
    
    var pSelected = null;
    var pIso = null;	// TODO: support more than just Isolators
    var pChildZero = null;
    var pRotGroup = null;
    var pQuat = null;
    var pTransOut = null;
    var pTransBack = null;
    var pRotQuatAttr = null;
    var pBox = null;
    var center = 0;
    var centerNeg = 0;
	
    for (var i=0; i < this.selectedObjects.length; i++)
    {
        pResultQuat.removeAllTargets();

        pMouseDown.setValueDirect(clickPoint.x, clickPoint.y);
        pMouseNow.setValueDirect(clickPoint.x, clickPoint.y);

        // for each selected moveable, attach it's Quat to the Inspector
        for (var j=0; j < this.selectedObjects.length; j++)
        {
            pSelected = this.selectedObjects[j];

            pRotGroup = getInspectionGroup(pSelected);
            //setInspectionGroupActivationState(pSelected, this.enabled.getValueDirect())
            if (pRotGroup && (pQuat = pRotGroup.getChild(2)))
            {
                // see notes in BwObjectInspector.cpp
                var values = [true];
                var params = new AttributeSetParams(-1, -1, eAttrSetOp.Replace, true, true);
                // it would seem easier to setValueDirect(true) here given params are
                // created with all default values but params are reused throughout this
                // function and setting the intended params values, per the notes in .cpp,
                // triggers a bug elsewhere. 
                pQuat.enabled.setValue(values, params);

                pRotQuatAttr = pQuat.rotationQuat;

                pResultQuat.addTarget(pRotQuatAttr);
				
                var prq = pRotQuatAttr.getValueDirect();
                pQuatAtMouseDown.setValueDirect(prq);

                var box = pSelected.bbox;
                var min = box.min.getValueDirect();
                var max = box.max.getValueDirect();
                center = new Vector3D(min.x, min.y, min.z);
                center.addVector(max);
                center.multiplyScalar(0.5);
	
                var pivot = pSelected.pivot.getValueDirect();
                if (pSelected.pivotAboutGeometricCenter.getValueDirect())
                {
                    pivot = center;
                }				
                var pivotNeg = new Vector3D(pivot.x, pivot.y, pivot.z);
                pivotNeg.multiplyScalar(-1);

                // translate to pivot before applying quaternion rotation
                // don't alert modified sinks here because this will cause antialiasing to reset
                values = [pivot.x, pivot.y, pivot.z];
                pRotGroup.getChild(0).translation.setValue(values, params);

                // don't alert modified sinks here because this will cause antialiasing to reset
                var scale = pSelected.worldScale.getValueDirect();
                var scaleInv = new Vector3D(1 / scale.x,
                    1 / scale.y,
                    1 / scale.z);
                values[0] = scaleInv.x;
                values[1] = scaleInv.y;
                values[2] = scaleInv.z;
                pRotGroup.getChild(1).scale.setValue(values, params);
                
                values[0] = scale.x;
                values[1] = scale.y;
                values[2] = scale.z;
                pRotGroup.getChild(3).scale.setValue(values, params);
            
                // translate back from pivot after applying quaternion rotation
                // don't alert modified sinks here because this will cause antialiasing to reset
                values[0] = pivotNeg.x;
                values[1] = pivotNeg.y;
                values[2] = pivotNeg.z;
                pRotGroup.getChild(4).translation.setValue(values, params);
            }
        }
    }   
}

ObjectInspector.prototype.runSelectionCleared = function()
{
    this.selectedObjects = [];
}

function ObjectInspector_TranslationDeltaModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        container.translationDeltaModified();
    }
}

function ObjectInspector_RotationDeltaModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        container.rotationDeltaModified();
    }
}

function ObjectInspector_TranslationNowModifiedCB(attribute, container)
{
// deprecated
}

function ObjectInspector_RotationNowModifiedCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        container.rotationNowModified();
    }
}

function ObjectInspector_SelectionOccurredCB(attribute, container)
{
    var enabled = container.enabled.getValueDirect();
    if (enabled)
    {
        container.runSelectionOccurred();
    }
}

function ObjectInspector_SelectionClearedCB(attribute, container)
{
    container.runSelectionCleared();
}


ConnectionMgr.prototype = new AttributeContainer();
ConnectionMgr.prototype.constructor = ConnectionMgr;

function ConnectionMgr()
{
    AttributeContainer.call(this);
    this.className = "ConnectionMgr";
    
    this.name = new StringAttr("ConnectionMgr");
    
    this.registerAttribute(this.name, "name");
    
    // TODO: finish adding connection helpers
    //registerConnectionHelper("DisconnectAllSources", null, ConnectionMgr.prototype.disconnectAllSources);
    registerConnectionHelper("DisconnectAllTargets", null, ConnectionMgr.prototype.disconnectAllTargets);
    registerConnectionHelper("dissolve", ConnectionMgr.prototype.connectDissolve, ConnectionMgr.prototype.disconnectDissolve);
}

ConnectionMgr.prototype.connectSceneInspection = function(inspector, camera)
{
    if (!inspector || !camera) return;
    
    var lastCamera = inspector.getCamera();
    if (lastCamera == camera)
    {
        // already connected
        return;
    }
    else if (lastCamera)
    {
        this.disconnectSceneInspection(inspector, lastCamera);
    }

    camera.getAttribute("sectorPosition").addTarget(inspector.getAttribute("viewPosition"), eAttrSetOp.Replace, null, true);
    camera.getAttribute("rotation").addTarget(inspector.getAttribute("viewRotation"), eAttrSetOp.Replace, null, true);

    inspector.getAttribute("resultPosition").addTarget(camera.getAttribute("sectorPosition"), eAttrSetOp.Replace, null, false);
    inspector.getAttribute("resultRotation").addTarget(camera.getAttribute("rotation"), eAttrSetOp.Replace, null, false);
    
    inspector.setCamera(camera);
}

ConnectionMgr.prototype.disconnectAllTargets = function(source, target)
{
    if (source)
    {
        var count = source.getAttributeCount();
        for (var i=0; i < count; i++)
        {
            var attribute = source.getAttributeAt(i);
            if (attribute)
            {
                attribute.removeAllTargets();
            }
        }
    }
}

ConnectionMgr.prototype.disconnectSceneInspection = function(inspector, camera)
{
    if (!inspector || !camera) return;
    
    camera.getAttribute("sectorPosition").removeTarget(inspector.getAttribute("viewPosition"));
    camera.getAttribute("rotation").removeTarget(inspector.getAttribute("viewRotation"));
    
    inspector.getAttribute("resultPosition").removeTarget(camera.getAttribute("sectorPosition"));
    inspector.getAttribute("resultRotation").removeTarget(camera.getAttribute("rotation"));
    
    inspector.setCamera(null);
}

ConnectionMgr.prototype.connectMapProjectionCalculator = function(mpc, pme)
{
    if (!mpc || !pme) return;

    mpc.getAttribute("resultPosition").addTarget(pme.getAttribute("position"));

    mpc.evaluate();
}

ConnectionMgr.prototype.disconnectMapProjectionCalculator = function(mpc, pme)
{
    if (!mpc || !pme) return;

    mpc.getAttribute("resultPosition").removeTarget(pme.getAttribute("position"));
}

ConnectionMgr.prototype.connectDissolve = function(evaluator, target)
{
    if (!evaluator || !target) return;
    
    var dissolve = target.getAttribute("dissolve");
    if (dissolve)
    {
        var resultValues = evaluator.getAttribute("resultValues");
        if (resultValues)
        {
            var resultValue = resultValues.getAt(0);
            if (resultValue)
            {
                resultValue.addTarget(dissolve);
            }
        }
    }
}

ConnectionMgr.prototype.disconnectDissolve = function(evaluator, target)
{
    if (!evaluator || !target) return;
    
    var dissolve = target.getAttribute("dissolve");
    if (dissolve)
    {
        var resultValues = evaluator.getAttribute("resultValues");
        if (resultValues)
        {
            var resultValue = resultValues.getAt(0);
            if (resultValue)
            {
                resultValue.removeTarget(dissolve);
            }
        }
    }
}

RenderAgent.prototype = new Agent();
RenderAgent.prototype.constructor = RenderAgent;

var ePlayState = {
    Unknown:    -1,
    
    Play:       0,
    Pause:      1,
    Stop:       2,
}

function RenderAgent(bridgeworks)
{
    Agent.call(this);
    this.className = "RenderAgent";
    
    this.bridgeworks = bridgeworks;
    
    this.name.setValueDirect("RenderAgent");
    this.timer = new Timer();
    
    this.frameRate = new NumberAttr(0);
    this.desiredFrameRate = new NumberAttr(30);
    this.timeIncrement = new NumberAttr(0);
    this.globalTimeInSecs = new NumberAttr(0);
    this.elapsedTimeInSecs = new NumberAttr(0);

    this.desiredFrameRate.addModifiedCB(RenderAgent_DesiredFrameRateModified, this);
    this.globalTimeInSecs.addModifiedCB(RenderAgent_GlobalTimeInSecsModified, this);
    
    this.registerAttribute(this.frameRate, "frameRate");
    this.registerAttribute(this.desiredFrameRate, "desiredFrameRate");
    this.registerAttribute(this.timeIncrement, "timeIncrement");
    this.registerAttribute(this.globalTimeInSecs, "globalTimeInSecs");
    this.registerAttribute(this.elapsedTimeInSecs, "elapsedTimeInSecs");
}

RenderAgent.prototype.render = function()
{
    this.timer.stop();
    var increment = this.timer.getTime();
    this.timer.start();
    
    var elapsedTime = this.elapsedTimeInSecs.getValueDirect() + increment;
    this.elapsedTimeInSecs.setValueDirect(elapsedTime);
    // update frame rate
    this.frameRate.setValueDirect(1.0 / increment);
    //alert(this.desiredFrameRate.getValueDirect());
    this.animateEvaluators(increment);
    this.executeRenderDirectives();
}

RenderAgent.prototype.animateEvaluators = function(time)
{
    var evaluators = this.registry.getByType(eAttrType.Evaluator);
    for (var i=0; i < evaluators.length; i++)
    {
        this.animateEvaluator(evaluators[i], time);
    }
}

RenderAgent.prototype.animateEvaluator = function(evaluator, time)
{
    var enabled = evaluator.getAttribute("enabled").getValueDirect();
    var expired = evaluator.getAttribute("expired").getValueDirect();

    var orphan = evaluator.getAttribute("orphan").getValueDirect();

    if (enabled && !expired)
    {
        switch (evaluator.className)
        {
            case "KeyframeInterpolator":
            {
                var params = new AttributeSetParams(-1, -1, eAttrSetOp.Add, true, true);
                evaluator.getAttribute("time").setValue(time, params);
            }
            break;
        }

        // don't evaluate scene/object inspection here, or any other evaluator not in the scene graph
        if (!orphan) evaluator.evaluate();
    }

    // if evaluator has expired, and it's set to "renderAndRelease", release it
    if (expired && evaluator.getAttribute("renderAndRelease").getValueDirect())
    {
        this.registry.unregister(evaluator);
    }
}

RenderAgent.prototype.executeRenderDirectives = function()
{
    var directives = this.registry.getByType(eAttrType.RenderDirective);
    if (directives)
    {
        this.bridgeworks.viewportMgr.layoutDirectives(directives);
        for (var i=0; i < directives.length; i++)
        {
            directives[i].execute();    
        }
    }   
}

// never executes
RenderAgent.prototype.globalTimeInSecsModified = function()
{
    var globalTime = this.globalTimeInSecs.getValueDirect();

    // synchronize elapsed time
    this.elapsedTimeInSecs.setValueDirect(globalTime);

    // get all evaluators and set their time to globalTimeInSecs
    if (this.registry)
    {
        var evaluators = this.registry.getByType(eAttrType.Evaluator);
        if (evaluators)
        {
            for (var i=0; i < evaluators.length; i++)
            {
                var evaluator = evaluators[i];
                if (evaluator)
                {
                    var time = evaluator.getAttribute("time");
                    if (time)
                    {
                        var globalTimeSyncEnabled = evaluator.getAttribute("globalTimeSyncEnabled");
                        if ((globalTimeSyncEnabled && globalTimeSyncEnabled.getValueDirect()) ||
                            !globalTimeSyncEnabled)
                        {
                            time.setValueDirect(globalTime);
                        }
                    }
                    
                    evaluator.evaluate(); // calling Evaluate() will reset "expired" flag based upon global time
                }
            }
        }

        // disable the rotation inspection group for the models in the scene;
        // this is required b/c user may have rotated models during
        // object inspection and Object Inspection uses transformation
        // nodes that will still be affecting the target
        var models = this.registry.getByType(eAttrType.Model);
        if (models)
        {
            for (var i=0; i < models.length; i++)
            {
                setInspectionGroupActivationState(models[i], false);
            }
        }
    }
}

RenderAgent.prototype.setEvaluatorPlayState = function(evaluator, state)
{
    if (!evaluator)
    {
        return this.setEvaluatorPlayState(state);
    }
    
    // perform state-specific processing
    var en = evaluator.getAttribute("enabled");
    switch (state)
    {
    case ePlayState.Play:
        {
            en.setValueDirect(true);
        }
        break;

    case ePlayState.Pause:
        {
            en.setValueDirect(false);
        }
        break;

    case ePlayState.Stop:
        {
            en.setValueDirect(false);

            // if kfi, set time to 0 and evaluate once to reset outputs to time 0
            switch (evaluator.className)
            {
            case "KeyframeInterpolator":
                {
                    evaluator.getAttribute("time").setValueDirect(0);
                    evaluator.evaluate();
                }
            }
        }
        break;
    }
    
    clearObjectPositionMap();
}

RenderAgent.prototype.setEvaluatorsPlayState = function(state)
{
    if (this.registry)
    {
        var evaluators = this.registry.getByType(eAttrType.Evaluator);
        if (evaluators)
        {
            for (i=0; i < evaluators.length; i++)
            {
                var evaluator = evaluators[i];
                
                var type = evaluator.attrType;

                // don't set play state for inspectors or any evaluators not in scenegraph
                var orphan = evaluator.getAttribute("orphan").getValueDirect();
                if (!orphan)
                {
                    this.setEvaluatorPlayState(evaluator, state)
                }

            }
        }
    }
}

RenderAgent.prototype.setDesiredFrameRate = function(rate)
{
    this.desiredFrameRate.setValueDirect(rate);
}

function RenderAgent_DesiredFrameRateModified(attribute, container)
{
}

function RenderAgent_GlobalTimeInSecsModified(attribute, container)
{
    var renderAgent = container.registry.find("RenderAgent");
    renderAgent.globalTimeInSecsModified();
}
var FRAME_RATE_DEFAULT = 30;
var FRAME_RATE_MAX = FRAME_RATE_DEFAULT * 32;
var FRAME_RATE_MIN = FRAME_RATE_DEFAULT * -32;

RenderController.prototype = new AttributeContainer();
RenderController.prototype.constructor = RenderController;

function RenderController(bridgeworks)
{
    AttributeContainer.call(this);
    this.className = "RenderController";
    
    this.playState = ePlayState.Pause;
    
    this.renderAgent = bridgeworks.renderAgent;
}

RenderController.prototype.fastForward = function()
{
    this.play();
    var rate = this.renderAgent.frameRate.getValueDirect();
    if (rate < 0)
    {
        this.renderAgent.desiredFrameRate.setValueDirect(FRAME_RATE_DEFAULT);
    }
    
    if (rate < FRAME_RATE_MAX)
	{
		this.renderAgent.desiredFrameRate.setValueDirect(Math.abs(this.renderAgent.frameRate) * 2);
	}
	else
	{
		// clamp to max fast forward speed
		this.renderAgent.desiredFrameRate.setValueDirect(FRAME_RATE_MAX);
	}
}

RenderController.prototype.pause = function()
{
    this.renderAgent.desiredFrameRate.setValueDirect(FRAME_RATE_DEFAULT);
    this.renderAgent.setEvaluatorsPlayState(ePlayState.Pause);
}

RenderController.prototype.play = function()
{
    this.renderAgent.desiredFrameRate.setValueDirect(FRAME_RATE_DEFAULT);
    this.renderAgent.setEvaluatorsPlayState(ePlayState.Play);    
}

RenderController.prototype.rewind = function()
{
    this.play();
    var rate = this.renderAgent.frameRate.getValueDirect();
    if (rate > 0)
    {
        this.renderAgent.desiredFrameRate.setValueDirect(FRAME_RATE_DEFAULT);
    }
    if (rate > FRAME_RATE_MIN)
    {
        this.renderAgent.desiredFrameRate.setValueDirect(Math.abs(this.renderAgent.frameRate) * -2);
    }
    else
    {
        this.renderAgent.desiredFrameRate.setValueDirect(FRAME_RATE_MIN);    
    }
}

RenderController.prototype.stop = function()
{
    this.renderAgent.setEvaluatorsPlayState(ePlayState.Stop);
    this.renderAgent.desiredFrameRate.setValueDirect(1);
}


/**
 *	Reverses the frame rate and updates a status label with the
 *	current playback speed.  Rewind is a negative frame rate
 *  that doubles with each push of the button until 
 *  BridgeworksObject.FRAME_RATE_MIN is reached
 *	
 *	@param void
 *	@return void
	
function DVD_Rewind()
{
    bridgeworks.updateScene("<Play/>");
    

    if (bridgeworks.renderAgent.frameRate > 0)
    {
        bridgeworks.renderAgent.setDesiredFrameRate(FRAME_RATE_DEFAULT);
    }
    
    if (bridgeworks.renderAgent.frameRate > FRAME_RATE_MIN)	// if fast forwarding or playing
	{
		bridgeworks.renderAgent.setDesiredFrameRate(Math.abs(bridgeworks.renderAgent.frameRate) * -2);
	}
	else	// max rewind value reached
	{
		// clamp to max rewind speed
		bridgeworks.renderAgent.setDesiredFrameRate(FRAME_RATE_MIN);
	}
    
    g_paused = false;

}
 */

/**
 *	Fast forwards the frame rate and updates a status label with the
 *	current playback speed.  Fast forward is a positive frame rate
 *  that doubles with each push of the button until
 *  BridgeworksObject.FRAME_RATE_MAX is reached
 *	
 *	@param void
 *	@return void

function DVD_FastForward()
{
    bridgeworks.updateScene("<Play/>");
    
    if (bridgeworks.renderAgent.frameRate < 0)
    {
        bridgeworks.renderAgent.setDesiredFrameRate(FRAME_RATE_DEFAULT);
    }
    
    if (bridgeworks.renderAgent.frameRate < FRAME_RATE_MAX)
	{
		bridgeworks.renderAgent.setDesiredFrameRate(Math.abs(bridgeworks.renderAgent.frameRate) * 2);
	}
	else
	{
		// clamp to max fast forward speed
		bridgeworks.renderAgent.setDesiredFrameRate(FRAME_RATE_MAX);
	}
    
    g_paused = false;

}
 */	

function Selections()
{
    this.viewports = [];
    this.cameras = [];
    this.lights = [];
    this.models = [];
    this.surfaces = [];
    this.labels = [];
    
    this.clear = function()
    {
        this.viewports = [];
        this.cameras = [];
        this.lights = [];
        this.models = [];
        this.surfaces = [];
        this.labels = [];
    }
}

SelectionListener.prototype = new EventListener();
SelectionListener.prototype.constructor = SelectionListener;

function SelectionListener()
{
    EventListener.call(this);
    this.className = "SelectionListener";

    this.rayPick = null;
    this.selections = new Selections();
    this.selected = null;
    
    this.name = new StringAttr("Selector");   
    this.selectionOccurred = new PulseAttr();
    this.selectionCleared = new PulseAttr();
    this.pointView = new Vector3DAttr();
    this.pointWorld = new Vector3DAttr();
    this.pointObject = new Vector3DAttr();
    this.pointGeo = new Vector3DAttr();
    this.triIndex = new NumberAttr();
    this.distance = new NumberAttr();
    this.distanceFromScreenCenter = new NumberAttr();
    this.computePivotDistance = new BooleanAttr(true);
    this.selectedName = new StringAttr();
    this.selectedElement = new NumberAttr(-1);	// this.registered when the selection has a selected element
    this.lastSelectedName = new StringAttr();

    this.pointWorld.addModifiedCB(SelectionListener_PointWorldModifiedCB, this);

    this.registerAttribute(this.selectionOccurred, "selectionOccurred");
    this.registerAttribute(this.selectionCleared, "selectionCleared");
    this.registerAttribute(this.pointView, "pointView");
    this.registerAttribute(this.pointWorld, "pointWorld");
    this.registerAttribute(this.pointObject, "pointObject");
    this.registerAttribute(this.pointGeo, "pointGeo");
    this.registerAttribute(this.triIndex, "triIndex");
    this.registerAttribute(this.distance, "distance");
    this.registerAttribute(this.distanceFromScreenCenter, "distanceFromScreenCenter");
    this.registerAttribute(this.computePivotDistance, "computePivotDistance");
    this.registerAttribute(this.selectedName, "selectedName");
    this.registerAttribute(this.lastSelectedName, "lastSelectedName");

    this.registerAttribute(this.name, "name");
    
    this.numResponses.setValueDirect(-1);
}

SelectionListener.prototype.setRayPick = function(rayPick)
{
    this.rayPick = rayPick;
    
    var clickPoint = this.rayPick.getAttribute("clickPoint");
    this.registerAttribute(clickPoint, "clickPoint");
    clickPoint.addModifiedCB(SelectionListener_ClickPointModifiedCB, this);
}

SelectionListener.prototype.eventPerformed = function(event)
{
    // if mouse-move event, don't process if any other mouse button is pressed (this affects object inspection)
    switch (event.type)
    {
        case eEventType.MouseMove:
        {
            if (event.inputId & MOUSEEVENT_LEFT_BUTTON ||
                event.inputId & MOUSEEVENT_MIDDLE_BUTTON ||
                event.inputId & MOUSEEVENT_RIGHT_BUTTON)
                return;        
        }
        break;
    }
    
    // TODO: allow for multi-select (clear if Ctrl is not pressed)
    this.clearSelections();
    
    this.getAttribute("clickPoint").setValueDirect(event.x, event.y);
}

SelectionListener.prototype.registerSelection = function(node, element)
{
    // only register first item
    if (this.selected) return;
    
    this.selected = node;
    
    // registering an attribute that has a NULL container (Get/SetContainer()) will set
    // the calling object as the container; don't want this behavior here
    var lastContainer = this.selected.getContainer();
    this.registerAttribute(this.selected, "Selected");	// unregistered in clearSelections()
    this.selected.setContainer(lastContainer);
	
    var name = node.getAttribute("name").getValueDirect().join("");
    //OutputDebugMsg("Selected: " + name);

    this.selectedName.setValueDirect(name);
    
    if (element >= 0)
    {
        this.selectedElement.setValueDirect(element);
        this.selected.registerAttribute(this.selectedElement, "selectedElement");
    }
}

SelectionListener.prototype.clearSelections = function()
{
    this.selections.clear();
   
    this.selectedElement.setValueDirect(-1);
    if (this.selected && this.selected.getAttribute("selectedElement"))
    {
        this.selected.unregisterAttribute(this.selectedElement);
    }

    this.selectedName.setValueDirect("");
    this.unregisterAttribute(this.selected);
    this.selected = null;
    
    this.selectionCleared.pulse();
}

SelectionListener.prototype.processPick = function(pick)
{
    for (var i=0; i < pick.path.length; i++)
    {
        var node = pick.path[i];
        
        // if selectable or show is false, or polygons are flipped, skip
        var selectable = node.getAttribute("selectable");
        var show = node.getAttribute("show");
        var flipPolygons = node.getAttribute("flipPolygons");
        if ((selectable && selectable.getValueDirect() == false) ||
            (show && show.getValueDirect() == false) ||
            (flipPolygons && flipPolygons.getValueDirect() == true))
            {
            continue;
        }      
        
        var element = -1;
        switch (node.attrType)
        {
            case eAttrType.PerspectiveCamera:
            case eAttrType.OrthographicCamera:
            {
                this.selections.cameras.push(node);
            }
            break;
		    
            case eAttrType.DirectionalLight:
            case eAttrType.PointLight:
            case eAttrType.SpotLight:
            {
                this.selections.lights.push(node);
            }
            break;
		    
            case eAttrType.Model:
            {
                this.selections.models.push(node);
                this.registerSelection(node, element);
            }
            break;
            
            case eAttrType.Surface:
            {
                this.selections.surfaces.push(node);
            }
            break;

            case eAttrType.Label:
            {
                this.selections.labels.push(node);
                this.registerRasterComponentSelection(node, element);
            }
        }
    }
    
    if (this.selected)
    {
        this.pointObject.setValueDirect(pick.intersectRecord.pointModel.x, pick.intersectRecord.pointModel.y, pick.intersectRecord.pointModel.z);
        this.pointWorld.setValueDirect(pick.intersectRecord.pointWorld.x, pick.intersectRecord.pointWorld.y, pick.intersectRecord.pointWorld.z);
        this.pointView.setValueDirect(pick.intersectRecord.pointView.x, pick.intersectRecord.pointView.y, pick.intersectRecord.pointView.z);
        this.triIndex.setValueDirect(pick.intersectRecord.triIndex);
        this.distance.setValueDirect(pick.intersectRecord.distance);
    }
    
    return (this.selected ? true : false);
}

SelectionListener.prototype.processPicks = function(picks)
{
    for (var i=0; i < picks.length; i++)
    {
        if (this.processPick(picks[i]) == true)
        {
            return true;
        }
    }   
    
    return false;
}

SelectionListener.prototype.registerRasterComponentSelection = function(rc,element)
{
    // if a GUI has already been selected, replace if node paramter has a greater renderedSlot value
    if (this.selected)
    {
        var selected = this.selected;
        if (selected)
        {
            var renderedSlotSelection = rc.renderedSlot.getValueDirect();
            var renderedSlotSelected = selected.renderedSlot.getValueDirect();

            if (renderedSlotSelection > renderedSlotSelected)
            {
                return this.registerSelection(rc, element, true);
            }
        }
    }
    else // no previous selection, register
    {
        this.registerSelection(rc, element);
    }

}
SelectionListener.prototype.clickPointModified = function()
{
    var point = this.getAttribute("clickPoint").getValueDirect();
    var vpMgr = this.registry.find("ViewportMgr");
    var vp = vpMgr.getViewportAtScreenXY(point.x, point.y);
    this.selections.viewports.push(vp.viewport);
    this.rayPick.getAttribute("viewport").setValueDirect(vp.viewport.x, vp.viewport.y, vp.viewport.width, vp.viewport.height);
    this.rayPick.getAttribute("camera").setValueDirect(vp.camera);
    var root = this.registry.getAttribute("rootPtr").getValueDirect();
    this.rayPick.execute(root);
    if (this.rayPick.picked.length > 0)
    {
        this.processPicks(this.rayPick.picked);
        this.selectionOccurred.pulse();
    }
    // update distance from screen center
    this.updateDistanceFromScreenCenter(root);
    // update scene inspector with selected camera
    this.updateSceneInspectionCamera(vp.camera);
}

SelectionListener.prototype.updateDistanceFromScreenCenter = function(root)
{
    if (this.computePivotDistance.getValueDirect() == false)
    {
        return;
    }

    // get window center and set to ray pick's click point
    var bworks = this.registry.find("Bridgeworks");
    if (!bworks) return;
    var x = bworks.canvas.width / 2;
    var y = bworks.canvas.height / 2;
    var lastClickPoint = this.rayPick.getAttribute("clickPoint").getValueDirect();
    var params = new AttributeSetParams(-1, -1, 0, false, false);   
    this.rayPick.getAttribute("clickPoint").setValueDirect(x, y, params);
    
    // execute
    this.rayPick.execute(root);
    
    // cycle through picked list and skip labels and poly lines
    // NOTE: we may eventually want the convenience of pivoting about a label because labels are sometimes easier 
    // to intersect (i.e., when the model is too small to intersect)
    var found = false;
    for (var i=0; i < this.rayPick.picked.length && !found; i++)
    {
        if (this.rayPick.picked[i].intersectRecord.distance != 0) // labels and poly lines have a distance of 0
        {
            // found selected geometry, update distance from screen center
            this.distanceFromScreenCenter.setValueDirect(this.rayPick.picked[i].intersectRecord.distance);
            found = true;
            break;
        }
    }

    // restore previous click point
    this.rayPick.getAttribute("clickPoint").setValueDirect(lastClickPoint.x, lastClickPoint.y, params);   
}

SelectionListener.prototype.updateSceneInspectionCamera = function(camera)
{
    var si = this.registry.find("SceneInspector");
    if (si)
    {
        if (si.getCamera() == camera) return; // already connected
        
        // disconnect old camera, connect new one
        var connectionMgr = this.registry.find("ConnectionMgr");
        if (connectionMgr)
        {
            connectionMgr.disconnectSceneInspection(si, si.getCamera());
            connectionMgr.connectSceneInspection(si, camera);
        }
    }
}

function SelectionListener_ClickPointModifiedCB(attribute, container)
{
    container.clickPointModified();
}

function SelectionListener_PointWorldModifiedCB(attribute, container)
{
}
ViewportLayout.prototype = new AttributeContainer();
ViewportLayout.prototype.constructor = ViewportLayout;

function ViewportLayout()
{
    AttributeContainer.call(this);
    this.className = "ViewportLayout";
    
    this.name = new StringAttr("ViewportLayout");
    this.width = new NumberAttr(0);
    this.height = new NumberAttr(0);
    
    this.registerAttribute(this.name, "name");
    this.registerAttribute(this.width, "width");
    this.registerAttribute(this.height, "height");
}

ViewportLayout.prototype.initialize = function()
{
}

ViewportLayout.prototype.layoutDirectives = function(directives)
{
}

GridLayout.prototype = new ViewportLayout();
GridLayout.prototype.constructor = GridLayout;

function GridLayout()
{
    ViewportLayout.call(this);
    this.className = "GridLayout";
    
    this.name.setValueDirect("GridLayout");
    
    this.rows = new NumberAttr(1);
    this.cols = new NumberAttr(1);
    
    this.registerAttribute(this.rows, "rows");
    this.registerAttribute(this.cols, "cols");
}

GridLayout.prototype.initialize = function()
{
    this.rows.setValueDirect(1);
    this.cols.setValueDirect(1);
    
    // call base-class implementation
    ViewportLayout.prototype.initialize.call(this);
}

GridLayout.prototype.layoutDirectives = function(directives)
{
	if (!directives)
	{
		return;
	}

    var width = this.width.getValueDirect();
    var height = this.height.getValueDirect();
    var rows = this.rows.getValueDirect();
    var cols = this.cols.getValueDirect();
    if (width <= 0 || height <= 0 || rows <= 0 || cols <= 0)
    {
        return;
    }
    
    var vpX = 0;
    var vpY = 0;
    var vpWidth = width / cols;
	var vpHeight = height / rows;
	var values = new Array(4);

	var nDirectives = directives.length;
	for (var i=0, n=0; i < rows && n < nDirectives; i++)
	{
		for (var j=0; j < cols && n < nDirectives; j++, n++)
		{
			values[0] = vpX;
			values[1] = vpY;
			values[2] = vpWidth;
			values[3] = vpHeight;

			directives[n].getAttribute("viewport").setValue(values);

			vpX += vpWidth;
		}

		vpX = 0;
		vpY += vpHeight;
	}
}
ViewportMgr.prototype = new AttributeContainer();
ViewportMgr.prototype.constructor = ViewportMgr;

function ViewportMgr()
{
    AttributeContainer.call(this);
    this.className = "ViewportMgr";
    
    this.name = new StringAttr("ViewportMgr");
    this.cursor = new StringAttr("Arrow");
    this.width = new NumberAttr(0);
    this.height = new NumberAttr(0);
    this.layout = new ReferenceAttr(null);
    
    this.cursor.addModifiedCB(ViewportMgr_CursorModifiedCB, this);
    this.width.addModifiedCB(ViewportMgr_WidthModifiedCB, this);
    this.height.addModifiedCB(ViewportMgr_HeightModifiedCB, this);
    this.layout.addModifiedCB(ViewportMgr_LayoutModifiedCB, this);
    
    this.registerAttribute(this.name, "name");
    this.registerAttribute(this.cursor, "cursor");
    this.registerAttribute(this.width, "width");
    this.registerAttribute(this.height, "height");
    this.registerAttribute(this.layout, "layout");
}

ViewportMgr.prototype.initLayout = function()
{
    var layout = this.layout.getValueDirect();
    if (layout)
    {
        layout.initialize();
    }
}

ViewportMgr.prototype.layoutDirectives = function(directives)
{
    var layout = this.layout.getValueDirect();
    if (layout)
    {
        layout.layoutDirectives(directives);   
    }
}

ViewportMgr.prototype.getViewportAtScreenXY = function(x, y)
{
    var width = this.width.getValueDirect();
    var height = this.height.getValueDirect();
    
    // make sure x, y fall between [0, viewport width/height]
    x = clamp(x, 0, width);
    y = clamp(y, 0, height);
    
    // get cameras
    var cameras = this.registry.getByType(eAttrType.Camera);
    
    // get smallest viewport containing screen x, y (necessary for picture-in-picture)
    var minWidth = width;
    var minHeight = height;
    var camera, viewport;
    for (var i=0; i < cameras.length; i++)
    {
        if (cameras[i].viewport.containsPoint(x, y) &&
            cameras[i].viewport.width <= minWidth &&
            cameras[i].viewport.height <= minHeight)
        {
            camera = cameras[i];
            viewport = cameras[i].viewport;
            minWidth = cameras[i].viewport.width;
            minHeight = cameras[i].viewport.height
        }
    }
    
    return { viewport: viewport, camera: camera };
}

function ViewportMgr_CursorModifiedCB(attribute, container)
{
    // TODO
}

function ViewportMgr_WidthModifiedCB(attribute, container)
{
    var layout = container.layout.getValueDirect();
    if (layout)
    {
        layout.getAttribute("width").setValueDirect(attribute.getValueDirect());
    }
}

function ViewportMgr_HeightModifiedCB(attribute, container)
{
    var layout = container.layout.getValueDirect();
    if (layout)
    {
        layout.getAttribute("height").setValueDirect(attribute.getValueDirect());
    }
}

function ViewportMgr_LayoutModifiedCB(attribute, container)
{
    var layout = attribute.getValueDirect();
    if (layout)
    {
        layout.getAttribute("width").setValueDirect(container.width.getValueDirect());
        layout.getAttribute("height").setValueDirect(container.height.getValueDirect());
    }
}
RasterComponentEventListener.prototype = new EventListener();
RasterComponentEventListener.prototype.constructor = Command;

function RasterComponentEventListener()
{
    EventListener.call(this);
    this.className = "RasterComponentEventListener";

    this.rcs = [];
    this.rcsSelectionState = [];
    this.rcListenMap = [];
    this.rcEventMap = [];
    this.styleMgr = null;
    
    this.selectionEvent = new InputEvent(eEventType.Unknown, 0, 0xffffffff, 0, eEventType.Key_Up);

	this.name.setValueDirect("RasterComponentEventListener");
	this.numResponses.setValueDirect(-1);
}

RasterComponentEventListener.prototype.eventPerformed = function(event)
{
    var enabled = this.enabled.getValueDirect();
    if (!enabled)
    {
        return;
    }
    
    var currSelectionState, lastSelectionState, selectionEventSelectionState;
	for (var i=0; i < this.rcs.length; i++)
	{
		if (!this.isListening(this.rcs[i]))
		{
			continue;
		}

		lastSelectionState = this.rcsSelectionState[i];
		currSelectionState = this.rcs[i].eventPerformed(event);
		
		if (this.styleMgr)
	    {
		    if (currSelectionState)
			{
				this.styleMgr.eventPerformed(event, this.rcs[i]);

				// send selected/focus/mouseover event depending upon event type and whether 
				// component doesn't have focus/didn't have selection
				switch (event.type)
				{
				case eEventType.MouseLeftClick:
					{
						// send element focus event (once)
						if (this.isListeningEvent(this.rcs[i], eEventType.ElementFocus) &&
							this.rcs[i].hasFocus.getValueDirect() <= 0)
						{
							this.selectionEvent.synchronize(event);
							this.selectionEvent.type = eEventType.ElementFocus;
							
							selectionEventSelectionState = m_rcs[i].eventPerformed(this.selectionEvent);
							this.styleMgr.eventPerformed(this.selectionEvent, this.rcs[i]);

							this.rcs[i].hasFocus.setValueDirect(1);
					    }
					}
					break;

				case eEventType.MouseMove:
					{
						// send element selected event (once)
						if (this.isListeningEvent(this.rcs[i], eEventType.ElementSelected) &&
							this.rcs[i].selected.getValueDirect() <= 0)
						{
							this.selectionEvent.synchronize(event);
							this.selectionEvent.type = eEventType.ElementSelected;
							
							selectionEventSelectionState = this.rcs[i].eventPerformed(this.selectionEvent);
							this.styleMgr.eventPerformed(this.selectionEvent, this.rcs[i]);
							this.rcs[i].selected.setValueDirect(1);
						}

						if (!lastSelectionState &&
							this.isListeningEvent(this.rcs[i], eEventType.MouseOver))
						{
							this.selectionEvent.synchronize(event);
							this.selectionEvent.type = eEventType.MouseOver;

							selectionEventSelectionState = this.rcs[i].eventPerformed(this.selectionEvent);
							this.styleMgr.eventPerformed(this.selectionEvent, this.rcs[i]);
						}
					}
					break;
				}
			}
			else // !currSelectionState
			{
				// send unselected/blur/mouseout event depending upon event type and whether 
				// component has focus/had selection
				switch (event.type)
				{
				case eEventType.MouseLeftDown:
				case eEventType.MouseLeftClick:
				case eEventType.MouseLeftDblClick:
				case eEventType.MouseMiddleDown:
				case eEventType.MouseMiddleClick:
				case eEventType.MouseMiddleDblClick:
				case eEventType.MouseRightDown:
				case eEventType.MouseRightClick:
				case eEventType.MouseRightDblClick:
				case eEventType.MouseWheelDown:
				case eEventType.MouseBothDown:
					{
						// send element blur event (once)
						if (this.isListeningEvent(this.rcs[i], eEventType.ElementBlur) &&
							this.rcs[i].hasFocus.getValueDirect() > 0)
						{
							this.selectionEvent.synchronize(event);
							this.selectionEvent.type = eEventType.ElementBlur;
							
							selectionEventSelectionState = this.rcs[i].eventPerformed(this.selectionEvent);
							this.styleMgr.eventPerformed(this.selectionEvent, this.rcs[i]);

							this.rcs[i].hasFocus.setValueDirect(-1);
						}
					}
					break;

				case eEventType.MouseMove:
					{
						// send element unselected event (once)
						if (this.isListeningEvent(this.rcs[i], eEventType.ElementUnselected) &&
							this.rcs[i].selected.getValueDirect() > 0)
						{
							this.selectionEvent.synchronize(event);
							this.selectionEvent.type = eEventType.ElementUnselected;
							
							selectionEventSelectionState = this.rcs[i].eventPerformed(this.selectionEvent);
							this.styleMgr.eventPerformed(this.selectionEvent, this.rcs[i]);
							this.rcs[i].selected.setValueDirect(-1);
						}

						if (lastSelectionState &&
							this.isListeningEvent(this.rcs[i], eEventType.MouseOut))
						{
							this.selectionEvent.synchronize(event);
							this.selectionEvent.type = eEventType.MouseOut;

							selectionEventSelectionState = this.rcs[i].eventPerformed(this.selectionEvent);
							this.styleMgr.eventPerformed(this.selectionEvent, this.rcs[i]);
						}
					}
					break;
				}
			}
		}

		this.rcsSelectionState[i] = currSelectionState;
	}
}

RasterComponentEventListener.prototype.registerComponent = function(rc, before)
{
    if (rc)
    {
        if (before)
        {
            var i = this.rcs.indexOf(before);
            if (i < 0) i = this.rcs.length;
            
            this.rcs.splice(i, 0, rc);
            this.rcsSelectionState.splice(i, 0, rc);
        }
        else
        {
            this.rcs.push(rc);
            this.rcsSelectionState.push(rc);
        }
    }
}

RasterComponentEventListener.prototype.unregisterComponent = function(rc)
{
    if (rc)
    {
        this.rcs.splice(this.rcs.indexOf(rc), 1);
    }
}

RasterComponentEventListener.prototype.Listen = function(rc)
{
    if (rc)
    {
        this.rcListenMap[rc] = true;
    }
}

RasterComponentEventListener.prototype.Ignore = function(rc)
{
    if (rc)
    {
        this.rcListenMap[rc] = false;
    }
}

RasterComponentEventListener.prototype.listenEvent = function(rc, eventType)
{
    if (rc)
    {
        if (this.rcEventMap[rc] == undefined)
        {
            this.rcEventMap[rc] = new Array();
        }

        this.rcEventMap[rc].push(eventType);
    }
}

RasterComponentEventListener.prototype.ignoreEvent = function(rc, eventType)
{
    if (rc)
    {
        if (this.rcEventMap[rc])
        {
            this.rcEventMap[rc].splice(this.rcEventMap[rc].indexOf(eventType), 1);
        }
    }
}

RasterComponentEventListener.prototype.setStyleMgr = function(styleMgr)
{
    this.styleMgr = styleMgr;
}

RasterComponentEventListener.prototype.setSelectionState = function(rc, selected)
{
    this.rcsSelectionState[rc] = selected;
}

RasterComponentEventListener.prototype.getComponent = function(n)
{
    if (n < this.rcs.length)
    {
        return this.rcs[n];
    }

    return null;
}

RasterComponentEventListener.prototype.isListening = function(rc)
{
    if (rc)
    {
        if (this.rcListenMap[rc])
        {
            return this.rcListenMap[rc];
        }
    }

    return false;
}

RasterComponentEventListener.prototype.isListeningEvent = function(rc, eventType)
{
    if (rc)
    {
        if (this.rcEventMap[rc])
        {
            if (this.rcEventMap[rc].indexOf(eventType) >= 0)
                return true;
        }
    }

    return false;
}




var g_objPosMap = {};

function addInspectionGroup(node, factory)
{

    // ensure that rotation group has not already been added
	var rotGroup = getInspectionGroup(node);
	
    if (rotGroup) return;
		
	var pGrp        = new Group();
    pGrp.setGraphMgr(factory.graphMgr);
    var pTranslate  = new Translate();
    pTranslate.setGraphMgr(factory.graphMgr);
    var pScaleInv   = new Scale();
    pScaleInv.setGraphMgr(factory.graphMgr);
    var pQuat       = new QuaternionRotate();
    pQuat.setGraphMgr(factory.graphMgr);
    var pTransBack  = new Translate();
    pTransBack.setGraphMgr(factory.graphMgr);
    var pScale      = new Scale();
    pScale.setGraphMgr(factory.graphMgr);
    
    pQuat.addModifiedCB(Util_InspectionGroup_RotationQuatModifiedCB, null);

    pGrp.name.setValueDirect("InspectionGroup");
	pTranslate.name.setValueDirect("Translate");
    pScaleInv.name.setValueDirect("ScaleInverse");
	pQuat.name.setValueDirect("Quaternion");
	pTransBack.name.setValueDirect("TranslateBack");			
    pScale.name.setValueDirect("Scale");

	pGrp.addChild(pTranslate); // child 0
    pGrp.addChild(pScaleInv);  // child 1
	pGrp.addChild(pQuat);      // child 2
    pGrp.addChild(pScale);     // child 3
	pGrp.addChild(pTransBack); // child 4

	var pChildZero = node.getChild(0);
	if (pChildZero)
	{
		pChildZero.insertChild(pGrp, 0);
	}

    node.registerAttribute(pTranslate.translation, "inspectionGroup_translate");
    node.registerAttribute(pScaleInv.scale, "inspectionGroup_scaleInverse");
    node.registerAttribute(pQuat.rotationQuat, "inspectionGroup_rotationQuat");
    node.registerAttribute(pQuat.enabled, "inspectionGroup_rotationEnabled");
    node.registerAttribute(pScale.scale, "inspectionGroup_scale");
    node.registerAttribute(pTransBack.translation, "inspectionGroup_translateBack");

    pTranslate.translation.setContainer(node);
    pScaleInv.scale.setContainer(node);
    pQuat.rotationQuat.setContainer(node);
    pQuat.enabled.setContainer(node);
    pScale.scale.setContainer(node);
    pTransBack.translation.setContainer(node);

	return;
}

function deleteInspectionGroup(node)
{
	var rotGroup = getInspectionGroup(node);
	if (rotGroup)
	{
        rotGroup.getChild(0).getAttribute("translation").setContainer(rotGroup.getChild(0));
        rotGroup.getChild(1).getAttribute("scale").setContainer(rotGroup.getChild(1));
        rotGroup.getChild(2).getAttribute("rotationQuat").setContainer(rotGroup.getChild(2));
        rotGroup.getChild(2).getAttribute("enabled").setContainer(rotGroup.getChild(2));
        rotGroup.getChild(3).getAttribute("scale").setContainer(rotGroup.getChild(3));
        rotGroup.getChild(4).getAttribute("translation").setContainer(rotGroup.getChild(4));

        node.unregisterAttribute(node.getAttribute("inspectionGroup_translate"));
        node.unregisterAttribute(node.getAttribute("inspectionGroup_scaleInverse"));
        node.unregisterAttribute(node.getAttribute("inspectionGroup_rotationQuat"));
        node.unregisterAttribute(node.getAttribute("inspectionGroup_rotationEnabled"));
        node.unregisterAttribute(node.getAttribute("inspectionGroup_scale"));
        node.unregisterAttribute(node.getAttribute("inspectionGroup_translateBack"));

        node.removeChild(rotGroup);

	}

	return;
}

function getInspectionGroup(moveableNode)
{
    var group = null;
    
	var childZero = moveableNode.getChild(0);
	if (childZero)
	{
		group = childZero.getNamedChild("InspectionGroup")
	}

	return group;
}

function setInspectionGroupActivationState(node, enable)
{
	var pRotGroup = getInspectionGroup(node);
	if (pRotGroup)
	{	
		var pQuat = pRotGroup.getChild(2);
		if (pQuat)
		{
			pQuat.enabled.setValueDirect(enable);

			if (!enable)
			{
				var quat = new Quaternion();
				quat.loadIdentity();

				var quatAttr = pQuat.rotationQuat;
				quatAttr.setValueDirect(quat);
			}
		}
		
		var pPos = node.getAttribute("position");
		if (enable)
		{
			if (!(node in g_objPosMap))
			{
				g_objPosMap[node] = pPos.getValueDirect();
			}
		}
		else // !enable
		{
			var pos = g_objPosMap[node];
			pPos.setValueDirect(pos);
		}
		
	}

	return;
}

function setInspectionGroupContainer(node)
{

	var pRotGroup = getInspectionGroup(node);
	if (pRotGroup)
	{	
        node.unregisterAttribute(node.getAttribute("inspectionGroup_translate"));
        node.unregisterAttribute(node.getAttribute("inspectionGroup_scaleInverse"));
        node.unregisterAttribute(node.getAttribute("inspectionGroup_rotationQuat"));
        node.unregisterAttribute(node.getAttribute("inspectionGroup_rotationEnabled"));
        node.unregisterAttribute(node.getAttribute("inspectionGroup_scale"));
        node.unregisterAttribute(node.getAttribute("inspectionGroup_translateBack"));

        node.registerAttribute(pRotGroup.getChild(0).getAttribute("translation"), "inspectionGroup_translate");
        node.registerAttribute(pRotGroup.getChild(1).getAttribute("scale"), "inspectionGroup_scaleInverse");
        node.registerAttribute(pRotGroup.getChild(2).getAttribute("rotationQuat"), "inspectionGroup_rotationQuat");
        node.registerAttribute(pRotGroup.getChild(2).getAttribute("enabled"), "inspectionGroup_rotationEnabled");
        node.registerAttribute(pRotGroup.getChild(3).getAttribute("scale"), "inspectionGroup_scale");
        node.registerAttribute(pRotGroup.getChild(4).getAttribute("translation"), "inspectionGroup_translateBack");

        pRotGroup.getChild(0).getAttribute("translation").setContainer(node);
        pRotGroup.getChild(1).getAttribute("scale").setContainer(node);
        pRotGroup.getChild(2).getAttribute("rotationQuat").setContainer(node);
        pRotGroup.getChild(2).getAttribute("enabled").setContainer(node);
        pRotGroup.getChild(3).getAttribute("scale").setContainer(node);
        pRotGroup.getChild(4).getAttribute("translation").setContainer(node);

    }

    return;
}


// Isn't called. Commented out in RenderAgent.cpp
function zeroInspectionGroup(node)
{
   var pRotGroup = getInspectionGroup(node);
	if (pRotGroup)
	{	
		var pQuat = pRotGroup.getChild(2);
		if (pQuat)
		{
			var quat = new Quaternion();
			quat.loadIdentity();

			var quatAttr = pQuat.rotationQuat;
			quatAttr.setValueDirect(quat);
		}
    }

    return;
}

function clearObjectPositionMap()
{
	g_objPosMap = {};

	return;
}

// Doesn't do anything.
function Util_InspectionGroup_RotationQuatModifiedCB(attribute, container)
{
    /* 
    CQuaternionf q;
	CQuaternionFloatAttr quat = dynamic_cast<CQuaternionFloatAttr>(attr);
	if (quat)
	{
		quat.getValueDirect(q);
	}
    */
}
SerializeCommand.prototype = new Command();
SerializeCommand.prototype.constructor = SerializeCommand;

function SerializeCommand()
{
    Command.call(this);
    this.className = "Serialize";
    this.attrType = eAttrType.Serialize;

    this.targetAttribute = null;
    this.target.addModifiedCB(this.SerializeCommand_TargetModifiedCB, this);
    this.directive = null;
    this.serialized = "";
}

SerializeCommand.prototype.execute = function()
{
    if (this.directive)
    {
//        if (this.target && this.directive)
//        {
//            if (this.directive.execute(this.target === 0))
//            {
//                this.serialized = this.directive.getSerialized();
//            }
//        }
//        else // !this.target
//        {
            this.serializeScene();
//        }
    }
}

SerializeCommand.prototype.serializeScene = function()
{
    var i;
    var container = null;
    var node = null;
    var context = new Context();
    var xstr;

    // root element open tag
    this.serialized = "<Session broadcast='false'>";

    //var attrContainerRegistry = this.registry.getAttributeContainerRegistry();
    var attrContainerRegistry = bridgeworks.registry;
    if (attrContainerRegistry)
    {
        var serializer = new XMLSerializer();
        var serial  = new Serializer();
        // set minimum flag so that only the minimum required for recreation is serialized
        //var serializeMinimum = serializer.getAttribute("serializeMinimum");
        //serializeMinimum.setValueDirect(true);

        var count = attrContainerRegistry.getObjectCount();

        // serialize device handlers
        for (i=1; i < count; i++)
        {
            container = attrContainerRegistry.getObject(i);
            if (container)
            {
                context.attribute = container;
                //context = document.createElement("Scene");
                //var inside = context.setAttribute("text",container);
                var buffer = "";

                // serialize
                //serializer
                serial.serialize(context.attribute,context.item,context.attributeName,context.container,buffer);
                xstr = serializer.serializeToString(context.attribute);

                console.log(xstr);
                this.serialized += buffer;
            }
        }

        // serialize root nodes (nodes without parents)
        for (i=0; i < count; i++)
        {
            if (node = attrContainerRegistry.getObject(i) &&
                !node.getParent(0))
            {
                this.directive.Execute(node);
                this.serialized += this.directive.getSerialized();
            }
        }

        // serialize non-device handlers, non-nodes, non-commands (commands need to be serialized last so that the objects
        // they affect will be declared first)
        for (i=0; i < count; i++)
        {
            container = attrContainerRegistry.getObject(i); if (!container) continue;
            if (!container && !container && !container)
            {
                if(container.toString() == "SelectionListener")
                //if (!strcmp(container.getTypeString(), "SelectionListener"))
                {
                    var computePivotDistance = container.getAttribute("computePivotDistance")
                        .getValueDirect();

                    this.serialized += "<Set target=\"Selector\" computePivotDistance=\"";
                    this.serialized += (computePivotDistance ? "true" : "false");
                    this.serialized += "\"/>";
                }
                else
                {
                    context.attribute = container;
                    var buffer = "";

                    // serialize
                    serializer.Serialize(context, buffer);
                    this.serialized += buffer;
                }
            }
        }

        // serialize any DisconnectAttributes commands (must come before ConnectAttributes in DefaultPreferences.xml)
        for (i=0; i < count; i++)
        {
            container = attrContainerRegistry.getObject(i); if (!container) continue;
            if(container &&(container.toString()=="DisconnectAttributes"))
            //if (container && !strcmp(container.getTypeString(), "DisconnectAttributes"))
            {
                context.attribute = container;
                var buffer = "";

                // serialize
                serializer.Serialize(context, buffer);
                this.serialized += buffer;
            }
        }

        // serialize remaining commands (DisconnectAttributes already serialized above)
        for (i=0; i < count; i++)
        {
            container = attrContainerRegistry.getObject(i); if (!container) continue;
            if(container && (container.toString() == "DisconnectAttributes"))
            //if (container && strcmp(container.getTypeString(), "DisconnectAttributes"))
            {
                context.attribute = container;
                var buffer = "";

                // serialize
                serializer.Serialize(context, buffer);
                this.serialized += buffer;
            }
        }
        /*
         // updateSectorOrigin
         const char* substr = NULL;
         std.prototype.string name = "";
         if ((substr = strstr(this.serialized.c_str(), "PerspectiveCamera")) ||
         (substr = strstr(this.serialized.c_str(), "OrthographicCamera")))
         {
         if (substr = strstr(substr, "<name>"))
         {
         substr += 6; // skip "<name>"
         while (*substr != '<')
         {
         name += *substr++;
         }

         this.serialized += ".set target=\"";
         this.serialized += name;
         this.serialized += "\" updateSectorOrigin=\"true\"/>";
         }
         }
         */
        // TODO: pivotCone
    }

    // root element close tag
    this.serialized += "</Session>";

    return;
}

SerializeCommand.prototype.Undo = function()
{

}

SerializeCommand.prototype.setRegistry = function(registry)
{
    // create serialize directive
    var factory = bridgeworks.registry.find("AttributeFactory");
    this.directive = factory.create("SerializeDirective");

    // call base-class implementation
    Command.prototype.setRegistry(registry);
}
SerializeCommand.prototype.getSerialized = function()
{
    return this.serialized;
    //return this.serialized.c_str();
}
SerializeCommand.prototype.SerializeCommand_TargetModifiedCB = function(container, attribute)
{
    var target = attribute.getValueDirect().join("");
    container.targetAttribute = container.registry.find(target);
}
// TODO
var eLWObjectTokens = 
{
    COLR    : 1129270354,
    DIFF    : 1145652806,
    LUMI    : 1280658761,
    SPEC    : 1397769539,
    TRAN    : 1414676814
};

function LWO2BlockData()
{
    this.type = "";
    this.ordinal = "";
    this.channel = 0;
    this.enable = 1;
    this.opacityType = 7;
    this.opacity = 1;
    this.opacityEnvelope = 0;
    this.negative = 0;
    this.center = new Vector3D();
    this.size = new Vector3D();
    this.coordSys = 0;
    this.projMode = 0;
    this.axis = 0;
    this.imageIndex = 0;
    this.widthWrap = 1;
    this.heightWrap = 1;
    this.widthWrapAmt = 0;
    this.heightWrapAmt = 0;
    this.uvMapName = "";
}

function LWO2SurfaceData()
{
    this.name = "";
    this.source = "";
    this.color = new Vector3D();
    this.diffuseLevel = 1;
    this.specularLevel = 0;
    this.luminosityLevel = 0;
    this.transparencyLevel = 0;
    this.glossiness = 0.4;
    this.doubleSided = false;
    this.smoothingAngle = 0;  
    this.blocks = [];
    this.addBlock = function()
    {
        this.blocks.push(new LWO2BlockData());
    }
    this.currentBlock = function()
    {
        return this.blocks.length > 0 ? this.blocks[this.blocks.length-1] : null;
    }
}

function LWO2ClipData()
{
    this.type = 0;
    this.negative = 0;
    
    var filename = "";
    var platformNeutralFilename = "";
    this.setPlatformNeutralFilename = function(_filename)
    {
        platformNeutralFilename = _filename;
        filename = _filename;
        if (filename.indexOf(':') >= 0)
        {
            var split = new Array();
            split = filename.split(':');
            filename = split[0] + ':' + '/' + split[1];
        }
    }
    this.setFilename = function(_filename)
    {
        filename = _filename;
        platformNeutralFilename = _filename;
        // check that filename is not in platform neutral format
        var pos = filename.indexOf(':');
        if (pos >= 0)
        {
            if (filename.charAt(pos+1) != '/' && filename.charAt(pos+1) != '\\')
            {
                var split = new Array();
                split = filename.split(':');
                filename = split[0] + ':' + '/' + split[1];
            }
        }
        // check that platform neutral filename is in platform neutral format
        pos = platformNeutralFilename.indexOf(':');
        if (pos >= 0)
        {
            if (platformNeutralFilename.charAt(pos+1) == '/' || platformNeutralFilename.charAt(pos+1) == '\\')
            {
                var split = new Array();
                split = platformNeutralFilename.split(':');
                platformNeutralFilename = split[0] + ':' + split[1].substr(1, split[1].length);
            }
        }
        this.getPlatformNeutralFilename = function()
        {
            return platformNeutralFilename;
        }
        this.getFilename = function()
        {
            return filename;
        }
    }
}

function LWO2EnvelopeData()
{
    this.userFormat = 0;
    this.type = 0;
    this.preBehavior = 0;
    this.postBehavior = 0;
    this.keyframes = [];
    
    this.currentKyframe = function()
    {
        return this.keyframes.length > 0 ? this.keyframes[this.keyframes.length-1] : null;
    }
}

function LWO2VMAPData()
{
    this.vertex = 0;
    this.u = 0;
    this.v = 0;
}

function LWO2VMADData()
{
    this.poly = 0;
    this.vertex = 0;
    this.u = 0;
    this.v = 0;
}

function LWO2PTAGData()
{
    this.poly = 0;
    this.tag = 0;
}

function LWO2LayerData()
{
    this.number = 0;
    this.name = "";
    this.pnts = [];
    this.pols = [];
    this.ptagsSURF = [];
    this.vmapsTXUV = [];
    this.vmadsTXUV = [];
    this.ptagsSURFMaxIndex = 0;
    this.pivot = new Vector3D();
    
    this.getVmap = function(type, name)
    {
        switch (type)
        {
            case 'TXUV':
                return this.vmapsTXUV[name];
                break;
            
            default: 
                return null;
        }
    }
    
    this.putVmap = function(type, name, vmap)
    {
        switch (type)
        {
            case 'TXUV':
                if (this.vmapsTXUV[name] == undefined) 
                    this.vmapsTXUV[name] = []
                this.vmapsTXUV[name].push(vmap);
                break;
        }
    }
    
    this.getVmad = function(type, name)
    {
        switch (type)
        {
            case 'TXUV':
                return this.vmadsTXUV[name];
                break;
            
            default: 
                return null;
        }
    }
    
    this.putVmad = function(type, name, vmad)
    {
        switch (type)
        {
            case 'TXUV':
                if (this.vmadsTXUV[name] == undefined) 
                    this.vmadsTXUV[name] = []
                this.vmadsTXUV[name].push(vmad);
                break;
        }
    }
    
    this.putPtag = function(ptag)
    {
        this.ptagsSURF.push(ptag);
    }
}

function LWO2Data()
{
    this.name = "";
    this.contentDir = "";
    this.layers = [];
    this.tags = [];
    this.surfaces = [];
    this.clips = [];
    this.envelopes = [];
    this.subChunkContext = "";
    this.evaluators = [];
    
    var currentClip = null;
    var currentEnvelope = null;
    var currentLayer = null;
    this.addLayer = function(number)
    {
        var layer = new LWO2LayerData();
        layer.number = number;
        if (this.layers.length <= number)
        {
            this.layers.length = number + 1;
        }
        this.layers[number] = layer;
        currentLayer = layer;
    }
    this.currentLayer = function()
    {
        return currentLayer;
    }
    this.addSurface = function(name, source)
    {
        var surface = new LWO2SurfaceData();
        surface.name = name;
        surface.source = source;
        this.surfaces.push(surface);
    }
    this.currentSurface = function()
    {
        return this.surfaces.length > 0 ? this.surfaces[this.surfaces.length-1] : null;
    }
    this.getSurface = function(name)
    {
        for (var i=0; i < this.surfaces.length; i++)
        {
            if (this.surfaces[i].name == name)
            {
                return this.surfaces[i];
            }
        }
        return null;
    }
    this.addClip = function(index)
    {
        var clip = new LWO2ClipData();
        if (this.clips.length <= index)
        {
            this.clips.length = index + 1;
        }
        this.clips[index] = clip;
        currentClip = clip;
    }
    this.currentClip = function()
    {
        return currentClip;
    }
    this.addEnvelope = function(index)
    {
        var envelope = new LWO2EnvelopeData();
        this.envelopes[index] = envelope;
        currentEnvelope = envelope;
    }
    this.currentEnvelope = function()
    {
        return currentEnvelope;
    }
}

LWObjectHandler.prototype = new ContentHandler();
LWObjectHandler.prototype.constructor = LWObjectHandler;

function LWObjectHandler()
{
    ContentHandler.call(this);
    this.className = "LWObjectHandler";
    
    this.lwo2DataHandlers = [];
    this.lwo2DataHandlersData = [];
}

LWObjectHandler.prototype.addObjectHandler = function(handler, data)
{
    this.lwo2DataHandlers.push(handler);
    this.lwo2DataHandlersData.push(data);
}

LWObjectHandler.prototype.parseFileStream = function(url)
{
    var filename = formFullPath(url, this.contentDirectory.getValueDirect().join(""));
    var filestream = loadBinaryResource(filename);
    if (filestream == null)
    {
        return -2;
    }

    var parser = new BinaryParser(filestream, true);

    // read file tag (must be 'FORM')
    if (parser.readUInt8() != 70 || // 'F'
    parser.readUInt8() != 79 || // 'O'
    parser.readUInt8() != 82 || // 'R'
    parser.readUInt8() != 77)   // 'M'
    {
        return -1;
    }

    // read file size
    var fileSize = parser.readUInt32();

    // read file type (must be 'LWO2')
    if (parser.readUInt8() != 76 || // 'L'
    parser.readUInt8() != 87 || // 'W'
    parser.readUInt8() != 79 || // 'O'
    parser.readUInt8() != 50)   // '2'
    {
        return -1;
    }
    fileSize -= 4; // subtract these 4 bytes from the file size

    var data = new LWO2Data();
    data.contentDir = this.contentDirectory.getValueDirect().join("");

    // set the model name (filename w/o extension)
    // TODO

    // read file chunks into LWOData
    while (fileSize > 0)
    {
        fileSize -= this.parseChunk(parser, data);
    }

    // pass data to consumer(s)
    for (var i = 0; i < this.lwo2DataHandlers.length; i++)
    {
        this.lwo2DataHandlers[i](data, this.lwo2DataHandlersData[i]);
    }

    return 0;
}

LWObjectHandler.prototype.parseChunk = function(parser, data)
{
    var bytesRead = 0;
    
    // ASSUMPTION MADE:  file stream pointer is currently sitting at a tag
    // i.e., has been advanced past header.

    // read chunk tag
    var tag = parser.readUInt32(); // bytesRead accounted for at end of method
    //alert("tag: " + tag);
    
    // read chunk size
    var chunkSize = parser.readUInt32(); // bytesRead accounted for at end of method
    //alert("chunkSize: " + chunkSize);
    
    // read chunk size bytes
    switch (tag)
    {
        case 1279351122: // 'LAYR'
            {
                var number = parser.readUInt16(); bytesRead += 2;
            
                var flags = parser.readUInt16(); bytesRead += 2;

                var x = parser.readFloat32(); bytesRead += 4;
                var y = parser.readFloat32(); bytesRead += 4;
                var z = parser.readFloat32(); bytesRead += 4;
            
                var name = this.readString(parser); bytesRead += name.bytesRead;
            
                if (chunkSize > bytesRead)
                {
                    var parent = parser.readUInt16(); bytesRead += 2;
                }

                data.addLayer(number);
                data.currentLayer().name = name.string;
                data.currentLayer().pivot.x = x;
                data.currentLayer().pivot.y = y;
                data.currentLayer().pivot.z = z;
            }
            break;
    
        case 1347310675: // 'PNTS'
            {
                var numPnts = chunkSize / 12;

                for (var i=0; i < numPnts; i++)
                {
                    var x = parser.readFloat32(); bytesRead += 4;
                    var y = parser.readFloat32(); bytesRead += 4;
                    var z = parser.readFloat32(); bytesRead += 4; 
            
                    data.currentLayer().pnts[i] = new Vector3D();
                    data.currentLayer().pnts[i].x = x;
                    data.currentLayer().pnts[i].y = y; 
                    data.currentLayer().pnts[i].z = z;                
                }
            }
            break;
    
        case 1347374163: // 'POLS'
            {
                var type = parser.readUInt32(); bytesRead += 4;
            
                var flags, numVerts;
                while (chunkSize > bytesRead)
                {
                    var poly = [];
                
                    flags = parser.readUInt16(); bytesRead += 2;
                    numVerts = flags & 0x03ff;
                    for (var i=0; i < numVerts; i++)
                    {
                        var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
                    
                        poly.push(index.index);
                    }
                
                    data.currentLayer().pols.push(poly);
                }
            }
            break;
        
        case 1413564243: // 'TAGS'
            {
                while (chunkSize > bytesRead)
                {
                    var tags = this.readString(parser); bytesRead += tags.bytesRead;
                    data.tags.push(tags.string);
                }
            }
            break;
      		
        case 1347699015: // 'PTAG'
            {
                var type = parser.readUInt32(); bytesRead += 4;
            
                while (chunkSize > bytesRead)
                {
                    var ptag = new LWO2PTAGData();
                    var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
                    ptag.poly = index.index;
                    ptag.tag = parser.readUInt16(); bytesRead += 2;
                
                    switch (type)
                    {
                        case 1398100550: // 'SURF'
                            {
                                data.currentLayer().putPtag(ptag);
                                data.currentLayer().ptagsSURFMaxIndex = Math.max(ptag.tag, data.currentLayer().ptagsSURFMaxIndex);
                            }
                            break;
                    }
                }
            }
            break;
    
        case 1447903568: // 'VMAP'
            {
                var type = parser.readUInt32(); bytesRead += 4;
                var dimension = parser.readUInt16(); bytesRead += 2;
                var name = this.readString(parser); bytesRead += name.bytesRead;
            
                var u, v, value;
                while (chunkSize > bytesRead)
                {
                    var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead; 
                
                    switch (type)
                    {
                        case 1415075158: // 'TXUV'
                            {
                                u = parser.readFloat32(); bytesRead += 4;
                                v = parser.readFloat32(); bytesRead += 4;
                        
                                var vmapData = new LWO2VMAPData();
                                vmapData.vertex = index.index;
                                vmapData.u = u;
                                vmapData.v = v;
                                data.currentLayer().putVmap('TXUV', name.string, vmapData);
                            }
                            break;
                    
                        default:
                            {
                                for (var i=0; i < dimension; i++)
                                {
                                    value = parser.readFloat32(); bytesRead += 4;       
                                }
                            }
                            break;    
                    }
                }
            }
            break;
        
        case 1447903556: // 'VMAD'
            {
                var type = parser.readUInt32(); bytesRead += 4;
                var dimension = parser.readUInt16(); bytesRead += 2;
                var name = this.readString(parser); bytesRead += name.bytesRead;
            
                var u, v, value;
                while (chunkSize > bytesRead)
                {
                    var vertIndex = this.readVariableLengthIndex(parser); bytesRead += vertIndex.bytesRead;
                    var polyIndex = this.readVariableLengthIndex(parser); bytesRead += polyIndex.bytesRead;
                
                    switch (type)
                    {
                        case 1415075158: // 'TXUV'
                            {
                                u = parser.readFloat32(); bytesRead += 4;
                                v = parser.readFloat32(); bytesRead += 4;
                        
                                var vmadData = new LWO2VMADData();
                                vmadData.vertex = vertIndex.index;
                                vmadData.poly = polyIndex.index;
                                vmadData.u = u;
                                vmadData.v = v;
                                data.currentLayer().putVmad('TXUV', name.string, vmadData);
                            }
                            break;
                    
                        default:
                            {
                                for (var i=0; i < dimension; i++)
                                {
                                    value = parser.readFloat32(); bytesRead += 4;       
                                }
                            }
                            break;    
                    }       
                }
            }
            break;
        
        case 1398100550: // 'SURF'
            {
                var name = this.readString(parser); bytesRead += name.bytesRead;
                var source = this.readString(parser); bytesRead += source.bytesRead;

                data.addSurface(name.string, source.string);
            
                // parse surface subchunks
                while (chunkSize > bytesRead)
                {
                    bytesRead += this.parseSubChunk(parser, data);
                }
            }
            break;
        
        case 1129072976: // 'CLIP'
            {
                var index = parser.readUInt32(); bytesRead += 4;
            
                data.addClip(index);
                data.subChunkContext = tag;
            
                // parse clip subchunks
                while (chunkSize > bytesRead)
                {
                    bytesRead += this.parseSubChunk(parser, data);
                }
            }
            break;
        
        case 1162761804: // 'ENVL'
            {
                var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
            
                data.addEnvelope(index.index);
            
                // parse envelope subchunks
                while (chunkSize > bytesRead)
                {
                    bytesRead += this.parseSubChunk(parser, data);
                }
            }
            break;
          
        default:
            {
                // unrecognized tag - seek to end of chunk
                while (chunkSize > bytesRead)
                {
                    parser.readUInt8(); bytesRead++;
                }
            }
            break;
    }
    
    // read pad byte if chunk size is odd
    if (chunkSize & 0x1)
    {
        parser.readUInt8(); bytesRead++;
    }
    
    // account for tag/chunk size (read at beginning of method)
    bytesRead += 8;
    //alert("bytesRead: " + bytesRead);
    
    return bytesRead;    
}

LWObjectHandler.prototype.parseSubChunk = function(parser, data)
{
    var bytesRead = 0;

    // read subchunk tag
    var tag = parser.readUInt32(); bytesRead += 4;

    // read subchunk size
    var subChunkSize = parser.readUInt16(); bytesRead += 2;

    // read subchunk size bytes
    switch (tag)
    {
        case 1129270354: // 'COLR'
            {
                data.currentSurface().color.x = parser.readFloat32(); bytesRead += 4;
                data.currentSurface().color.y = parser.readFloat32(); bytesRead += 4;
                data.currentSurface().color.z = parser.readFloat32(); bytesRead += 4;
            
                if (subChunkSize > (bytesRead - 6))
                {
                    var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
                }    
            }
            break;
        
        case 1145652806: // 'DIFF'
            {
                data.currentSurface().diffuseLevel = parser.readFloat32(); bytesRead += 4;
            
                if (subChunkSize > (bytesRead - 6))
                {
                    var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
                } 
            }
            break;
    
        case 1280658761: // 'LUMI'  
            {
                data.currentSurface().luminosityLevel = parser.readFloat32(); bytesRead += 4;
            
                if (subChunkSize > (bytesRead - 6))
                {
                    var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
                }
            }
            break;
        
        case 1397769539: // 'SPEC'
            {
                data.currentSurface().specularLevel = parser.readFloat32(); bytesRead += 4;
            
                if (subChunkSize > (bytesRead - 6))
                {
                    var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
                }
            }
            break;
        
        case 1414676814: // 'TRAN'
            {
                data.currentSurface().transparencyLevel = parser.readFloat32(); bytesRead += 4;
            
                if (subChunkSize > (bytesRead - 6))
                {
                    var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
                }
            }
            break;
        
        case 1196183379: // 'GLOS'
            {
                data.currentSurface().glossiness = parser.readFloat32(); bytesRead += 4;
            
                if (subChunkSize > (bytesRead - 6))
                {
                    var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
                }
            }
            break;
        
        case 1397310533: // 'SIDE'
            {
                data.currentSurface().doubleSided = (parser.readUInt16() == 3 ? true : false); bytesRead += 2;            
            }
            break;
        
        case 1397571918: // 'SMAN'
            {
                data.currentSurface().smoothingAngle = parser.readFloat32(); bytesRead += 4;
            }
            break;
        
        case 1398032716: // 'STIL'
        case 1095649613: // 'ANIM'
        case 1230194001: // 'ISEQ'
            {
                var filename = this.readString(parser); bytesRead += filename.bytesRead;
            
                // skip subsequent chunk data
                while (subChunkSize > (bytesRead - 6))
                {
                    parser.readUInt8(); bytesRead += 1;
                }
            
                data.currentClip().type = tag;
                data.currentClip().setFilename(filename.string);
            }
            break;
        
        case 1313163073: // 'NEGA'
            {
                var negative = parser.readUInt16(); bytesRead += 2;
            
                if (data.subChunkContext == 'IMAP')
                {
                    data.currentSurface().currentBlock().negative = negative;
                }
                else if (data.subChunkContext == 'CLIP')
                {
                    data.currentClip().negative = negative;
                }
            }
            break;
        
        case 1112297291: // 'BLOK'
            {
                data.currentSurface().addBlock();
            }
            break;
        
        case 1229799760: // 'IMAP'
            {
                var ordinal = this.readString(parser); bytesRead += ordinal.bytesRead;
            
                data.currentSurface().currentBlock().type = 'IMAP';
                data.currentSurface().currentBlock().ordinal = ordinal.string;
                data.subChunkContext = 'IMAP';
            }
            break;
        
        case 1128808782: // 'CHAN'
            {
                var channel = parser.readUInt32(); bytesRead += 4;
            
                if (data.subChunkContext == 'IMAP')
                {
                    data.currentSurface().currentBlock().channel = channel;
                }
            }
            break;
        
        case 1162756418: // 'ENAB'
            {
                data.currentSurface().currentBlock().enable = parser.readUInt16(); bytesRead += 2;
            }
            break;
        
        case 1330659651: // 'OPAC'
            {
                data.currentSurface().currentBlock().opacityType = parser.readUInt16(); bytesRead += 2;
                data.currentSurface().currentBlock().opacity = parser.readFloat32(); bytesRead += 4;
            
                if (subChunkSize > (bytesRead - 6))
                {
                    var envelope = this.readVariableLengthIndex(parser); bytesRead += envelope.bytesRead;
                
                    data.currentSurface().currentBlock().opacityEnvelope = envelope.index;
                }
            }
            break;
        
        case 1414349136: // 'TMAP'
            {
            }
            break;
         
        case 1129206866: // 'CNTR'
            {
                data.currentSurface().currentBlock().center.x = parser.readFloat32(); bytesRead += 4;
                data.currentSurface().currentBlock().center.y = parser.readFloat32(); bytesRead += 4;
                data.currentSurface().currentBlock().center.z = parser.readFloat32(); bytesRead += 4;
            
                while (subChunkSize > (bytesRead - 6))
                {
                    var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
                }
            }
            break;
        
        case 1397316165: // 'SIZE'
            {
                data.currentSurface().currentBlock().size.x = parser.readFloat32(); bytesRead += 4;
                data.currentSurface().currentBlock().size.y = parser.readFloat32(); bytesRead += 4;
                data.currentSurface().currentBlock().size.z = parser.readFloat32(); bytesRead += 4;
            
                while (subChunkSize > (bytesRead - 6))
                {
                    var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
                }
            }
            break;
        
        case 1129535827: // 'CSYS'
            {
                data.currentSurface().currentBlock().coordSys = parser.readUInt16(); bytesRead += 2;
            }
            break;
        
        case 1347571530: // 'PROJ'
            {
                data.currentSurface().currentBlock().projMode = parser.readUInt16(); bytesRead += 2;
            }
            break;
        
        case 1096304979: // 'AXIS'
            {
                var axis = parser.readUInt16(); bytesRead += 2;
            
                if (data.subChunkContext == 'IMAP')
                {
                    data.currentSurface().currentBlock().axis = axis;
                }
            }
            break;
        
        case 1229799751: // 'IMAG'
            {
                var image = this.readVariableLengthIndex(parser); bytesRead += image.bytesRead;
            
                data.currentSurface().currentBlock().imageIndex = image.index;
            }
            break;
        
        case 1465008464: // 'WRAP'
            {
                data.currentSurface().currentBlock().widthWrap = parser.readUInt16(); bytesRead += 2;
                data.currentSurface().currentBlock().heightWrap = parser.readUInt16(); bytesRead += 2;
            }
            break;
        
        case 1465012311: // 'WRPW'
            {
                data.currentSurface().currentBlock().widthWrapAmt = parser.readFloat32(); bytesRead += 4;
            
                if (subChunkSize > (bytesRead - 6))
                {
                    var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
                }
            }
            break;
        
        case 1465012296: // 'WRPH'
            {
                data.currentSurface().currentBlock().heightWrapAmt = parser.readFloat32(); bytesRead += 4;
            
                if (subChunkSize > (bytesRead - 6))
                {
                    var index = this.readVariableLengthIndex(parser); bytesRead += index.bytesRead;
                }
            }
            break;
        
        case 1447903568: // 'VMAP'
            {
                var name = this.readString(parser); bytesRead += name.bytesRead;
            
                data.currentSurface().currentBlock().uvMapName = name.string; 
            }
            break;
        
        case 1415139397: // 'TYPE'
            {
                data.currentEnvelope().userFormat = parser.readUInt8(); bytesRead += 1;
                data.currentEnvelope().type = parser.readUInt8(); bytesRead += 1;
            }
            break;
        
        case 1347568928: // 'PRE '
            {
                data.currentEnvelope().preBehavior = parser.readUInt16(); bytesRead += 2;
            }
            break;
        
            //case 1262836000: // 'KEY '
            {
                // TODO        
            }
            break;
       
            //case 1397768526: // 'SPAN'
            {
                // TODO
                //case 1413693984: // 'TCB '
                //case 1212502605: // 'HERM'
                //case 1111841353: // 'BEZI'
                //case 1111841330: // 'BEZ2'
                //case 1398031696: // 'STEP'
                //case 1279872581: // 'LINE'
            }
            break;
        
        case 1347375956: // 'POST'
            {
                data.currentEnvelope().postBehavior = parser.readUInt16(); bytesRead += 2;
            }
            break;

        default:
            {
                // unrecognized tag - seek to end of chunk
                while (subChunkSize > (bytesRead - 6))
                {
                    parser.readUInt8(); bytesRead += 1;
                }
            }
            break;
    }
    
    // read pad byte if subchunk size is odd
    if (subChunkSize & 0x1)
    {
        parser.readUInt8(); bytesRead += 1;
    }
    
    return bytesRead;
}

LWObjectHandler.prototype.readString = function(parser)
{
    var s = "";
    var c = 0;
    var count = 0;
    do
    {
        c = parser.readUInt8(); count++;
        s += String.fromCharCode(c);
        
    } while (c);
    
    // read pad byte if length is odd
    if (count & 0x1)
    {
        parser.readUInt8(); count++;   
    }
    
    return { string: s, bytesRead: count };
}

LWObjectHandler.prototype.readVariableLengthIndex = function(parser)
{
    var i = 0;
    var c = new Array(4);
    var count = 0;
    
    c[0] = parser.readUInt8(); count++;
    c[1] = parser.readUInt8(); count++;
    
    if (c[0] < 0xff00) // 2-byte form
    {
        i = c[0] << 8 | c[1];
    }
    else // 4-byte form
    {
        c[2] = parser.readUInt8(); count++;
        c[3] = parser.readUInt8(); count++;
        
        i = c[1] << 16 | c[2] << 8 | c[3];
    }

    return { index: i, bytesRead: count };
}

LWObjectHandler.prototype.matchesType = function(type)
{
    return (type == "lwo");
}
LWObjectBuilder.prototype = new ContentBuilder();
LWObjectBuilder.prototype.constructor = LWObjectBuilder;

function LWObjectBuilder()
{
    ContentBuilder.call(this);
    this.className = "LWObjectBuilder";
    
    this.graphMgr = null;
    
    this.indexGeometry = new BooleanAttr(true);
    
    this.registerAttribute(this.indexGeometry, "indexGeometry");
}

LWObjectBuilder.prototype.visitHandler = function(handler)
{
    handler.addObjectHandler(LWObjectBuilder_ObjectHandler, this);
}

LWObjectBuilder.prototype.finalize = function()
{
}

LWObjectBuilder.prototype.matchesType = function(type)
{
    return (type == "lwo");
}

LWObjectBuilder.prototype.allocateModel = function(data)
{
    var model = null;
    var layer = this.layer;
    if (layer == 0)
    {
        for (var i=0; i < data.layers.length; i++)
        {
            // allocate model if necessary (otherwise use the model passed to the builder)
            if (!this.models[0])
            {
                var factory = this.registry.find("AttributeFactory");
                model = factory.create("Model");
                this.models.push(model);
            }
            else model = this.models[0];

            // TODO: matching model/replace model surfaces

            // define model attributes
            this.describeModel(data, data.layers[i], model);
        }
    }
    else if (layer <= data.layers.length) // layer > 0
    {
        // allocate model if necessary (otherwise use the model passed to the builder)
        if (!this.models[0])
        {
            var factory = this.registry.find("AttributeFactory");
            model = factory.create("Model");
            this.models.push(model);
        }
        else model = this.models[0];
        
        // TODO: matching model/replace model surfaces

        // define model attributes
        this.describeModel(data, data.layers[layer-1], model);
    }
}

LWObjectBuilder.prototype.describeModel = function(data, layer, model)
{
    
    var factory = this.registry.find("AttributeFactory");
    
    // set pivot if not already set by scene
    var pivot = model.getAttribute("pivot");
    if (model.getAttributeModificationCount(pivot) == 0)
    {
        pivot.setValue(layer.pivot.v());
    }

    // build list of tri, line, and point poly indices indexed by surface number
    var numSurfaces = layer.ptagsSURFMaxIndex + 1;
    var triPolys = new Array(numSurfaces);
    var linePolys = new Array(numSurfaces);
    var pointPolys = new Array(numSurfaces);
    for (var i = 0; i < numSurfaces; i++)
    {
        triPolys[i] = [];
        linePolys[i] = [];
        pointPolys[i] = [];
    }

    var polyIndex, surfIndex;
    var numPtagsSURF = layer.ptagsSURF.length;
    for (var ptag = 0; ptag < numPtagsSURF; ptag++)
    {
        polyIndex = layer.ptagsSURF[ptag].poly;
        surfIndex = layer.ptagsSURF[ptag].tag;

        switch (layer.pols[polyIndex].length)
        {
            case 3: triPolys[surfIndex].push(polyIndex); break;
            case 2: linePolys[surfIndex].push(polyIndex); break;
            case 1: pointPolys[surfIndex].push(polyIndex); break;
        }
    }

    // create surfaces for geometry
    var surfaces = new Array(numSurfaces);
    for (var surfIndex = 0; surfIndex < numSurfaces; surfIndex++)
    {
        surfaces[surfIndex] = this.allocateSurface(data, layer, surfIndex);

        // add surface to model (model will target surface and set its color to the surface)
        model.addSurface(surfaces[surfIndex]);
    }

    // set layer vertices to model
    var layerVertices = new Array(layer.pnts.length * 3);
    for (var layerVertex = 0; layerVertex < layer.pnts.length; layerVertex++)
    {
        layerVertices[layerVertex * 3] = layer.pnts[layerVertex].x;
        layerVertices[layerVertex * 3 + 1] = layer.pnts[layerVertex].y;
        layerVertices[layerVertex * 3 + 2] = layer.pnts[layerVertex].z;
    }
    model.getAttribute("vertices").setValue(layerVertices);

    // create geometry (calculate polygon normals for tris)
    var vertexPolyNormals = [];
    var vertexNormals = [];
    var vertexOrder = [];
    var vertexMinMax = [];
    var polyOrder = [];
    var triLists = [];
    var triVertices = [];
    var triPolyNormals = [];

    vertexPolyNormals.length = layer.pnts.length;
    for (var i = 0; i < vertexPolyNormals.length; i++)
    {
        vertexPolyNormals[i] = [];
    }
    vertexNormals.length = numSurfaces;
    vertexOrder.length = numSurfaces;
    vertexMinMax.length = numSurfaces;
    polyOrder.length = numSurfaces;
    triLists.length = numSurfaces;
    triVertices.length = numSurfaces;
    triPolyNormals.length = numSurfaces;

    for (var surfIndex = 0; surfIndex < surfaces.length; surfIndex++)
    {
        var vertices = [];
        var normals = [];
        vertexNormals[surfIndex] = []
        vertexOrder[surfIndex] = [];
        vertexMinMax[surfIndex] = new Pair();
        vertexMinMax[surfIndex].first = vertexMinMax[surfIndex].second = 0;
        polyOrder[surfIndex] = [];
        triPolyNormals[surfIndex] = [];

        // tris   
        var polys = triPolys[surfIndex];
        var numPolys = polys.length;
        var leg1 = new Vector3D();
        var leg2 = new Vector3D();
        for (var polyIndex = 0; polyIndex < numPolys; polyIndex++)
        {
            var poly = layer.pols[polys[polyIndex]];
            for (var vertex = 0; vertex < 3; vertex++)
            {
                var point = layer.pnts[poly[vertex]];
                vertices.push(point.x);
                vertices.push(point.y);
                vertices.push(point.z);

                vertexOrder[surfIndex].push(poly[vertex]);
                vertexMinMax[surfIndex].first = Math.min(poly[vertex], vertexMinMax[surfIndex].first);
                vertexMinMax[surfIndex].second = Math.min(poly[vertex], vertexMinMax[surfIndex].second);
                polyOrder[surfIndex].push(polys[polyIndex]);
            }

            // get vertex indices
            var vertIndex0 = poly[0];
            var vertIndex1 = poly[1];
            var vertIndex2 = poly[2];

            // calculate polygon normal
            var point0 = layer.pnts[vertIndex0];
            var point1 = layer.pnts[vertIndex1];
            var point2 = layer.pnts[vertIndex2];

            leg1.load(point1.x - point0.x,
                      point1.y - point0.y,
                      point1.z - point0.z);

            leg2.load(point2.x - point0.x,
                      point2.y - point0.y,
                      point2.z - point0.z);

            var cross = crossProduct(leg1, leg2);
            cross.normalize();

            normals.push(cross.x)
            normals.push(cross.y);
            normals.push(cross.z);

            normals.push(cross.x)
            normals.push(cross.y);
            normals.push(cross.z);

            normals.push(cross.x)
            normals.push(cross.y);
            normals.push(cross.z);

            vertexNormals[surfIndex].push(new Pair(vertIndex0, cross));
            vertexNormals[surfIndex].push(new Pair(vertIndex1, cross));
            vertexNormals[surfIndex].push(new Pair(vertIndex2, cross));

            vertexPolyNormals[vertIndex0].push(cross);
            vertexPolyNormals[vertIndex1].push(cross);
            vertexPolyNormals[vertIndex2].push(cross);

            triPolyNormals[surfIndex].push(cross);
            triPolyNormals[surfIndex].push(cross);
            triPolyNormals[surfIndex].push(cross);
        }

        if (vertices.length)
        {
            var triList = factory.create("TriList");

            model.addGeometry(triList, surfaces[surfIndex]); // TODO: call method that accepts indices

            triList.getAttribute("vertices").setValue(vertices);
            triList.getAttribute("normals").setValue(normals);

            triLists[surfIndex] = triList;
            triVertices[surfIndex] = vertices;
        }

        // lines
        vertices = [];
        polys = linePolys[surfIndex];
        numPolys = polys.length;
        
        for (var polyIndex = 0; polyIndex < numPolys; polyIndex++)
        {
            var poly = layer.pols[polyIndex];
            if (poly.length < 2) continue;
            
            for (var vertex = 0; vertex < 2; vertex++)
            {
                var point = layer.pnts[poly[vertex]];
                
                vertices.push(point.x);
                vertices.push(point.y);
                vertices.push(point.z);
                
            }
        }
        
        if (vertices.length)
        {
            var lineList = factory.create("LineList");

            model.addGeometry(lineList, surfaces[surfIndex]); // TODO: call method that accepts indices   
            
            lineList.getAttribute("vertices").setValue(vertices);
        }
        
        // points
        vertices = [];
        polys = pointPolys[surfIndex];
        numPolys = polys.length;
        
        for (var polyIndex = 0; polyIndex < numPolys; polyIndex++)
        {
            var poly = layer.pols[polyIndex];
            
            var point = layer.pnts[poly[0]];
            
            vertices.push(point.x);
            vertices.push(point.y);
            vertices.push(point.z);
                
        }
        
        if (vertices.length)
        {
            var pointList = factory.create("PointList");

            model.addGeometry(pointList, surfaces[surfIndex]); // TODO: call method that accepts indices   
            
            pointList.getAttribute("vertices").setValue(vertices);
        }
    }

    // calculate smooth normals for tris
    var smoothNormals = [];
    for (var surfIndex = 0; surfIndex < surfaces.length; surfIndex++)
    {
        if (!triLists[surfIndex]) continue;

        var surface = data.getSurface(data.tags[surfIndex]);
        if (!surface) continue;
        
        var smoothingAngle = surface.smoothingAngle;
        if (smoothingAngle <= 0) continue;

        var cosSmoothingAngle = Math.cos(smoothingAngle);

        smoothNormals.length = vertexNormals[surfIndex].length;
        for (var i = 0; i < smoothNormals.length; i++)
        {
            smoothNormals[i] = new Vector3D();
        }

        // for each vertex normal...
        for (var vn = 0; vn < vertexNormals[surfIndex].length; vn++)
        {
            var vertexIndex = vertexNormals[surfIndex][vn].first;
            var vertexNormal = vertexNormals[surfIndex][vn].second;

            // for each polygon normal...
            for (var vpn = 0; vpn < vertexPolyNormals[vertexIndex].length; vpn++)
            {
                var polyNormal = vertexPolyNormals[vertexIndex][vpn];
                var angle = cosineAngleBetween(vertexNormal, polyNormal);
                if (Math.acos(angle) <= smoothingAngle)
                {
                    smoothNormals[vn].x += polyNormal.x;
                    smoothNormals[vn].y += polyNormal.y;
                    smoothNormals[vn].z += polyNormal.z;
                }
            }

            smoothNormals[vn].normalize();
        }

        // arrange smooth normals in array
        var smoothedNormals = [];
        for (var i = 0; i < smoothNormals.length; i++)
        {
            smoothedNormals.push(smoothNormals[i].x);
            smoothedNormals.push(smoothNormals[i].y);
            smoothedNormals.push(smoothNormals[i].z);
        }
        smoothNormals.length = 0;

        triLists[surfIndex].getAttribute("normals").setValue(smoothedNormals);
    }

    // load textures
    for (var surfIndex = 0; surfIndex < surfaces.length; surfIndex++)
    {
        var surfaceData = data.getSurface(surfaces[surfIndex].getAttribute("name").getValueDirect().join(""));
        if (surfaceData)
        {
            var textures = this.loadTextures(data, layer, surfaceData, surfaces[surfIndex]);

            // calculate texture coordinates
            for (var i = 0; i < textures.length; i++)
            {
                var uvCoords = this.calculateTextureCoords(data, layer, textures[i].second, triVertices[surfIndex],
                                                       triPolyNormals[surfIndex], vertexOrder[surfIndex],
                                                       polyOrder[surfIndex]);
                if (uvCoords)
                {
                    triLists[surfIndex].getUVCoords(textures[i].first).setValueDirect(uvCoords);
                }
            }
        }
    }

    // TODO: index vertices if requested
}

LWObjectBuilder.prototype.allocateSurface = function(data, layer, surfaceNumber)
{
     var factory = this.registry.find("AttributeFactory");
     surface = factory.create("Surface");
     
     var name = data.tags[surfaceNumber];
     surface.getAttribute("name").setValueDirect(name);
     
     this.describeSurface(data.getSurface(name), surface);
     
     return surface;
}

LWObjectBuilder.prototype.describeSurface = function(data, surface)
{
    // TEMPTEST
    if (!data) return;
    
    // color
    var values = [];
    values.push(data.color.x);
    values.push(data.color.y);
    values.push(data.color.z);
    values.push(1);
    surface.getAttribute("color").setValue(values);
    
    // ambient level (use diffuse since ambient level is not specified
    surface.getAttribute("ambientLevel").setValueDirect(data.diffuseLevel);
    
    // diffuse level
    surface.getAttribute("diffuseLevel").setValueDirect(data.diffuseLevel);
    
    // specular level
    surface.getAttribute("specularLevel").setValueDirect(data.specularLevel);
    
    // emissive level
    surface.getAttribute("emissiveLevel").setValueDirect(data.luminosityLevel);
    
    // glossiness
    surface.getAttribute("glossiness").setValueDirect(data.glossiness);
    
    // opacity
    surface.getAttribute("opacity").setValueDirect(1 - data.transparencyLevel);
    
    // double-sidedness
    surface.getAttribute("doubleSided").setValueDirect(data.doubleSided ? true : false);
}

LWObjectBuilder.prototype.loadTextures = function(data, layer, surfaceData, surface)
{
    var textures = [];

    // arrange blocks into ordered lists indexed by channel
    var channelBlocks = [];
    for (var i = 0; i < surfaceData.blocks.length; i++)
    {
        var block = surfaceData.blocks[i];
        if (block.type != 'IMAP') continue;

        if (!channelBlocks[block.channel])
        {
            channelBlocks[block.channel] = []
        }
        channelBlocks[block.channel].push(block);
    }

    // allocate textures for supported channel types

    // color
    if (channelBlocks[eLWObjectTokens.COLR])
    {
        this.allocateTextures(eTextureType.Color, data, layer, channelBlocks[eLWObjectTokens.COLR], surface, textures);
    }

    // diffuse
    if (channelBlocks[eLWObjectTokens.DIFF])
    {
        this.allocateTextures(eTextureType.Diffuse, data, layer, channelBlocks[eLWObjectTokens.DIFF], surface, textures);
    }

    // luminosity
    if (channelBlocks[eLWObjectTokens.LUMI])
    {
        this.allocateTextures(eTextureType.Luminosity, data, layer, channelBlocks[eLWObjectTokens.LUMI], surface, textures);
    }

    // specular
    if (channelBlocks[eLWObjectTokens.SPEC])
    {
        this.allocateTextures(eTextureType.Specular, data, layer, channelBlocks[eLWObjectTokens.SPEC], surface, textures);
    }

    // transparency
    if (channelBlocks[eLWObjectTokens.TRAN])
    {
        this.allocateTextures(eTextureType.Transparency, data, layer, channelBlocks[eLWObjectTokens.TRAN], surface, textures);
    }

    return textures;
}

LWObjectBuilder.prototype.allocateTextures = function(type, data, layer, blocks, surface, textures)
{  
    // create a media texture object for each normal or additive texture layer; if subsequent
    // layer is alpha, add as texture alpha channel
    for (var i=0; i < blocks.length; i++)
    {
        var block = blocks[i];
        if (block.opacityType != 0 && 
            block.opacityType != 7)
            continue;
            
        var imageClip = data.clips[block.imageIndex];
        if (!imageClip)
            continue;
            
        var alphaClip = null;
        if (i+1 < blocks.length)
        {
            if (blocks[i+1].opacityType == 5)
            {
                alphaClip = data.clips[blocks[i+1].imageIndex];
            }    
        } 
        
        var widthWrap, heightWrap;
        switch (block.widthWrap)
        {
        case 0: widthWrap = eTextureWrap.None; break;
        case 1: widthWrap = eTextureWrap.Repeat; break; 
        case 2: widthWrap = eTextureWrap.Mirror; break;
        case 3: widthWrap = eTextureWrap.Clamp; break;
        } 
        switch (block.heightWrap)
        {
        case 0: heightWrap = eTextureWrap.None; break;
        case 1: heightWrap = eTextureWrap.Repeat; break; 
        case 2: heightWrap = eTextureWrap.Mirror; break;
        case 3: heightWrap = eTextureWrap.Clamp; break;
        }     
        
        var filename = imageClip.getFilename();
        
        // strip any local paths saved by the modeler
        var ndx = filename.lastIndexOf('/');
        
        filename = ndx === -1 ? filename : filename.substring(ndx+1);
         
        var clipFilename = data.contentDir + "images/" + filename;
        
        // setup negate image flag based upon whether or not the graphics card uses
        // inverted alpha values, and if this is a transparency, diffuse, luminosity,
        // or specularity texture
        var negateImage = block.negative ? true : false;
        if (this.invertAlpha && 
           (type == eTextureType.Transparency ||
            type == eTextureType.Diffuse ||
            type == eTextureType.Luminosity ||
            type == eTextureType.Specularity))
        {
            negateImage = !negateImage;
        }

        // setup negate alpha flag based upon existance of an alpha clip and 
        // whether or not the graphics card uses inverted alpha values
        var negateAlpha = false;
        if (alphaClip)
        {
            negateAlpha = blocks[i+1].negative ? true : false;
            if (this.invertAlpha)
            {
                negateAlpha = !negateAlpha;
            }
        }
        
        // TODO: check if texture with same attributes has already been created;
        // if not, or if an opacity envelope is being used, allocate new one
        var mediaTexture = null;
        
        var factory = this.registry.find("AttributeFactory");
        mediaTexture = factory.create("MediaTexture");
           
        mediaTexture.getAttribute("name").setValueDirect(""); // TODO
        mediaTexture.getAttribute("textureType").setValueDirect(type);
        mediaTexture.getAttribute("opacity").setValueDirect(block.opacity);
        mediaTexture.getAttribute("widthWrap").setValueDirect(widthWrap);
        mediaTexture.getAttribute("heightWrap").setValueDirect(heightWrap);
        mediaTexture.getAttribute("mipmappingEnabled").setValueDirect(false);
        mediaTexture.getAttribute("imageFilename").setValueDirect(clipFilename);
        mediaTexture.getAttribute("negateImage").setValueDirect(negateImage);
        mediaTexture.getAttribute("negateAlpha").setValueDirect(negateAlpha);
        if (alphaClip)
        {
            mediaTexture.getAttribute("alphaFilename").setValueDirect(data.contentDir + alphaClip.getFilename());
        }
        
        // TODO: if opacity is an envelope, create a KeyframeInterpolator and attach to texture opacity attr

        textures.push(new Pair(mediaTexture, block));
        surface.addTexture(mediaTexture);
    }       
}

LWObjectBuilder.prototype.calculateTextureCoords = function(data, layer, blockData, vertices, polyNormals,
                                                            vertIndices, polyIndices)
{
    if (!data ||
        !layer ||
        !blockData ||
        !vertices ||
        !polyNormals ||
        !vertIndices ||
        !polyIndices)
    {
        return null;
    }

    var uvCoords = []
    var numVertices = vertices.length / 3;

    switch (blockData.projMode)
    {
        case 0: // planar
        case 1: // cylindrical
        case 2: // spherical
            {
                var i, vertex, uv;
                for (i = 0, vertex = 0, uv = 0; i < numVertices; i++, vertex += 3, uv += 2)
                {
                    uv = this.mapXYZtoUV(vertices[vertex], vertices[vertex + 1], vertices[vertex + 2],
                                     blockData.center, blockData.size, blockData.projMode, blockData.axis,
                                     blockData.widthWrapAmt, blockData.heightWrapAmt);
                    uvCoords.push(uv.u);
                    uvCoords.push(uv.v);
                }
            }
            break;

        case 3: // cubic
            {
                var i, vertex, uv;
                for (i = 0, vertex = 0, uv = 0; i < numVertices; i++, vertex += 3, uv += 2)
                {
                    polyNormal = polyNormals[i];

                    if (Math.acos(cosineAngleBetween(polyNormal, new Vector3D(1, 0, 0))) <= QUARTERPI ||
                    Math.acos(cosineAngleBetween(polyNormal, new Vector3D(-1, 0, 0))) <= QUARTERPI)
                    {
                        axis = 0; // x
                    }
                    else if (Math.acos(cosineAngleBetween(polyNormal, new Vector3D(0, 1, 0))) <= QUARTERPI ||
                         Math.acos(cosineAngleBetween(polyNormal, new Vector3D(0, -1, 0))) <= QUARTERPI)
                    {
                        axis = 1; // y
                    }
                    else
                    {
                        axis = 2; // z
                    }

                    uv = this.mapXYZtoUV(vertices[vertex], vertices[vertex + 1], vertices[vertex + 2],
                                     blockData.center, blockData.size, 0, axis,
                                     blockData.widthWrapAmt, blockData.heightWrapAmt);
                    uvCoords.push(uv.u);
                    uvCoords.push(uv.v);
                }
            }
            break;

        case 5: // UV
            {
                var vmap = layer.getVmap('TXUV', blockData.uvMapName);
                //if (vmap) quick_sort(vmap, LWObjectBuilder_CompareVmapEntries);

                var vmad = layer.getVmad('TXUV', blockData.uvMapName);
                //if (vmad) quick_sort(vmad, LWObjectBuilder_CompareVmadEntries);

                var i, vertIndex, polyIndex, uv, uvSet;
                for (i = 0, uv = 0; i < numVertices; i++, uv += 2)
                {
                    vertIndex = vertIndices[i];
                    polyIndex = polyIndices[i];
                    uvSet = false;

                    // check for vmad entry (overrides vmap entry)
                    if (vmad && vmad.length)
                    {
                        for (var vmad_entries = 0; vmad_entries < vmad.length; vmad_entries++)
                        {
                            if (vmad[vmad_entries].poly > polyIndex)
                            {
                                break;
                            }

                            if (vmad[vmad_entries].poly == polyIndex)
                            {
                                if (vmad[vmad_entries].vertex == vertIndex)
                                {
                                    uvCoords[uv] = vmad[vmad_entries].u;
                                    uvCoords[uv + 1] = vmad[vmad_entries].v;
                                    uvSet = true;
                                    break;
                                }
                            }
                        }

                        if (uvSet)
                        {
                            // don't retrieve from vmap
                            continue;
                        }
                    }

                    // check for vmap entry
                    if (vmap && vmap.length)
                    {
                        for (var vmap_entries = 0; vmap_entries < vmap.length; vmap_entries++)
                        {
                            if (vmap[vmap_entries].vertex > vertIndex)
                            {
                                break;
                            }

                            if (vmap[vmap_entries].vertex == vertIndex)
                            {
                                uvCoords[uv] = vmap[vmap_entries].u;
                                uvCoords[uv + 1] = vmap[vmap_entries].v;
                                uvSet = true;
                                break;
                            }
                        }
                    }

                    if (!uvSet)
                    {
                        uvCoords[uv] = 0;
                        uvCoords[uv + 1] = 0;
                    }
                }
            }
            break;

        default:
            {
                //alert(blockData.projMode);
            }
            break;
    }

    return uvCoords;
}

LWObjectBuilder.prototype.mapXYZtoUV = function(x, y, z, textureCenter, textureSize, projMode, axis, widthWrapAmt, heightWrapAmt)
{
    var lon, lat;
    var integerPart;

    var u = 0;
    var v = 0;

    switch(projMode)
    {
    case 0: // planar
        switch(axis)
        {
        case 0: // x
            u = (z - textureCenter.z) / textureSize.z + 0.5;
            v = (y - textureCenter.y) / textureSize.y + 0.5;
            break;

        case 1: // y
            u = (x - textureCenter.x) / textureSize.x + 0.5;
            v = (z - textureCenter.z) / textureSize.z + 0.5;
            break;

        case 2: // z
        default:
            u = (x - textureCenter.x) / textureSize.x + 0.5;
            v = (y - textureCenter.y) / textureSize.y + 0.5;
            break;
        }
        break;

   case 1: // cylindrical
        x -= textureCenter.x;
        y -= textureCenter.y;
        z -= textureCenter.z;
        
        switch(axis)
        {
        case 0: // x
            lon = XYZtoH(z, x, y);
            u = lon / (TWOPI * widthWrapAmt);
            v = x / textureSize.x + 0.5;
            break;

        case 1: // y
            lon = XYZtoH(x, y, z);
            u = lon / (TWOPI * widthWrapAmt);
            v = y / textureSize.y + 0.5;
            break;

        case 2: // z
        default:
            lon = XYZtoH(-x, z, -y);
            u = lon / (TWOPI * widthWrapAmt);
            v = -z / textureSize.z + 0.5;
            break;
        }

        // clamp u coordinate to range [0, 1)
        u = modf(u).fractionalPart;
        if (u < 0) u += 1;
        break;

   case 2: // spherical
        x -= textureCenter.x;
        y -= textureCenter.y;
        z -= textureCenter.z;

        switch (axis)
        {
        case 0: // x
            var hp = XYZtoHP(z, x, -y);
            lon = hp.heading;
            lat = hp.pitch;
            break;

        case 1: // y
            var hp = XYZtoHP(-x, y, z);
            lon = hp.heading;
            lat = hp.pitch;
            break;

        case 2: // z
        default:
            var hp = XYZtoHP(-x, z, -y);
            lon = hp.heading;
            lat = hp.pitch;
            break;
        }

        u = modf(1 - (lon / TWOPI * widthWrapAmt)).fractionalPart;
        v = 1 - modf(0.5 - (lat / Math.PI * heightWrapAmt)).fractionalPart;

        break;
    }
 
    return { u: u, v: v };   
}

function LWObjectBuilder_ObjectHandler(data, builder)
{
    builder.allocateModel(data);
}

function LWObjectBuilder_CompareVmapEntries(elem1, elem2)
{
    if (elem1.vertex < elem2.vertex) return -1;
    if (elem1.vertex > elem2.vertex) return 1;
    return 0;
}

function LWObjectBuilder_CompareVmadEntries(elem1, elem2)
{
    if (elem1.poly < elem2.poly) return -1;
    if (elem1.poly > elem2.poly) return 1;
    return 0;
}
LWSceneHandler.prototype = new ContentHandler();
LWSceneHandler.prototype.constructor = LWSceneHandler;

function LWSceneHandler()
{
    ContentHandler.call(this);
    this.className = "LWSceneHandler";
    
    this.tokenHandlers = [];
    this.tokenHandlersData = [];
}

LWSceneHandler.prototype.addTokenHandler = function(handler, data)
{
    this.tokenHandlers.push(handler);
    this.tokenHandlersData.push(data);
}

LWSceneHandler.prototype.parseFileStream = function(url)
{
    var filename = formFullPath(url, this.contentDirectory.getValueDirect().join(""));
    var filestream = loadTextResource(filename);
    if (filestream == null)
    {
        return -2;
    }
    
    var parser = new TextParser(filestream);
    
    var tokens;
    while (tokens = parser.readLineTokens())
    {
        // pass tokens to consumer(s)
        for (var i=0; i < this.tokenHandlers.length; i++)
        {
            this.tokenHandlers[i](tokens, this.tokenHandlersData[i]);    
        }    
    }
}
LWSceneBuilder.prototype = new ContentBuilder();
LWSceneBuilder.prototype.constructor = LWSceneBuilder;

function LWSceneBuilder()
{
    ContentBuilder.call(this);
    this.className = "LWSceneBuilder";
    
    this.graphMgr = null;
    this.currChannel = 0;   // motions
    
    this.indexGeometry = new BooleanAttr(true);
    
    this.registerAttribute(this.indexGeometry, "indexGeometry");
}

LWSceneBuilder.prototype.visitHandler = function(handler)
{
    handler.addTokenHandler(LWSceneBuilder_TokenHandler, this);
}

LWSceneBuilder.prototype.finalize = function()
{
    }

LWSceneBuilder.prototype.matchesType = function(type)
{
    return (type == "lws" ||
            type == "mot");
}

LWSceneBuilder.prototype.allocateSceneElement = function(tokens)
{
    
    
    switch (tokens[0])
    {
        case "LoadObjectLayer":
        {
            
        }
        break;
        case "NumChannels":
        {
            var numChannels = parseInt(tokens[1], 10);
            
            var eval = this.evaluators[this.evaluators.length-1];
            
            eval.setNumChannels(numChannels);
            
            // attach to target (if specified)
            switch (numChannels)
            {
                case 1:
                    this.attachDissolveInterpolator(this.evaluators[this.evaluators.length-1], 
                        this.registry.find(this.evaluators[this.evaluators.length-1].getAttribute("target").getValueDirect().join("")));
                    break;
                   
                default:
                    this.attachKeyframeInterpolator(this.evaluators[this.evaluators.length-1], 
                        this.registry.find(this.evaluators[this.evaluators.length-1].getAttribute("target").getValueDirect().join("")));
                    break;
            }
        }
        break;
        
        case "Channel":
        {
            this.currChannel = parseInt(tokens[1], 10);
        }
        break;
        
        case "Key":
        {
            if (this.evaluators.length <= 0) break;
            
            var keyframes = this.evaluators[this.evaluators.length-1].getAttribute("channels").getAt(this.currChannel);
            if (!keyframes) break;
            
            var keyframe = new KeyframeAttr();
            for (var i=1; i < tokens.length; i++)
            {
                switch (i)
                {
                    // value
                    case 1:
                    {
                        var f = parseFloat(tokens[i]);

                        // if channel 3, 4, or 5, convert value to degrees
                        if (this.currChannel == 3 || this.currChannel == 4 || this.currChannel == 5)
                        {
                            f = toDegrees(f);
                        }

                        keyframe.getAttribute("value").setValueDirect(f);
                    }
                    break;
                    // time
                    case 2:
                        keyframe.getAttribute("time").setValueDirect(parseFloat(tokens[i]));
                        break;
                    case 3:
                    {
                        var shape = parseInt(tokens[i]);
                        switch (shape)
                        {
                            case 0:
                                keyframe.getAttribute("shape").setValueDirect(eKeyframeShape.TCB);
                                break;
                            case 1:
                                //keyframe.getAttribute("shape").setValueDirect();	// TODO: Hermite Spline
                                break;
                            case 2:
                                keyframe.getAttribute("shape").setValueDirect(eKeyframeShape.Bezier1D);
                                break;
                            case 3:
                                keyframe.getAttribute("shape").setValueDirect(eKeyframeShape.Linear);
                                break;
                            case 4:
                                keyframe.getAttribute("shape").setValueDirect(eKeyframeShape.Stepped);
                                break;
                            case 5:
                                keyframe.getAttribute("shape").setValueDirect(eKeyframeShape.Bezier2D);
                                break;
                            default:
                                keyframe.getAttribute("shape").setValueDirect(eKeyframeShape.Linear);
                                break;
                        }
                    }
                    break;
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                        keyframe.getAttribute("params").getAt(i-3-1).setValueDirect(parseFloat(tokens[i]));
                        break;
                    default:
                        break;
                }
            }
			
            // set to keyframe interpolator
            keyframes.push_back(keyframe);
        }
        break;
        
        case "Behaviors":
        {
            if (this.evaluators.length <= 0) break;
            
            var preBehaviors = this.evaluators[this.evaluators.length-1].getAttribute("preBehaviors").getAt(this.currChannel);
            var postBehaviors = this.evaluators[this.evaluators.length-1].getAttribute("postBehaviors").getAt(this.currChannel);
            if (!preBehaviors || !postBehaviors) break;
            
            var pre = parseInt(tokens[1], 10);
            var post = parseInt(tokens[2], 10);
            
            preBehaviors.setValueDirect(pre);
            postBehaviors.setValueDirect(post);            
        }
        break;
    }
}

LWSceneBuilder.prototype.attachKeyframeInterpolator = function(kfi, target)
{
    if (!kfi || !target) return;
    
    var numChannels = kfi.getAttribute("channels").vector.length;
    
    for (var channel=0; channel < numChannels; channel++)
    {
        var resultValue = kfi.getAttribute("resultValues").getAt(channel);
        
        switch (channel)
        {
            case 0: // x pos
                resultValue.addElementTarget(target.getAttribute("position"), 0, 0);
                break;

            case 1: // y pos
                resultValue.addElementTarget(target.getAttribute("position"), 0, 1);
                break;

            case 2: // z pos
                resultValue.addElementTarget(target.getAttribute("position"), 0, 2);
                break;

            case 3: // heading (y rot)
                resultValue.addElementTarget(target.getAttribute("rotation"), 0, 1);
                break;

            case 4: // pitch (x rot)
                resultValue.addElementTarget(target.getAttribute("rotation"), 0, 0);
                break;

            case 5: // bank (z rot)
                resultValue.addElementTarget(target.getAttribute("rotation"), 0, 2);
                break;

            case 6: // x scale
                resultValue.addElementTarget(target.getAttribute("scale"), 0, 0);
                break;

            case 7: // y scale
                resultValue.addElementTarget(target.getAttribute("scale"), 0, 1);
                break;

            case 8: // z scale
                resultValue.addElementTarget(target.getAttribute("scale"), 0, 2);
                break;
        }   
    }
    
    kfi.getAttribute("time").setValueDirect(0);
}

LWSceneBuilder.prototype.attachDissolveInterpolator = function(kfi, target)
{
    if (!kfi || !target) return;
    
    var resultValue = kfi.getAttribute("resultValues").getAt(0);
    
    resultValue.addElementTarget(target.getAttribute("dissolve"), 0, 0);
}

function LWSceneBuilder_TokenHandler(tokens, builder)
{
    builder.allocateSceneElement(tokens);
}
AttributeFactory.prototype = new AttributeContainer();
AttributeFactory.prototype.constructor = AttributeFactory;

function AttributeFactory()
{
    AttributeContainer.call(this);
    this.className = "AttributeFactory";
    this.attrType = eAttrType.AttributeFactory;
    
    this.newResourceProcs = [];
    this.configureProcs = [];
    this.finalizeProcs = [];
    this.registry = null;
    this.graphMgr = null;
    
    this.name = new StringAttr("AttributeFactory");
    
    this.registerAttribute(this.name, "name");
    
    this.initializeNewResourceMap();
    this.initializeConfigureMap();
    this.initializeFinalizeMap();
}

AttributeFactory.prototype.create = function(name)
{
    var resource = null;
    
    // invoke new resource proc
    var newResourceProc = this.newResourceProcs[name];
    if (newResourceProc)
    {
        resource = newResourceProc(name, this);
    }
    if (!resource) return null;
    
    // invoke configuration proc (if specified)
    var configureProc = this.configureProcs[name];
    if (configureProc)
    {
        configureProc(resource, this);
    }
    
    // if resource is a container, register name and userData if not already registered
	if (resource.isContainer())
	{
	    if (!resource.getAttribute("name")) resource.registerAttribute(new StringAttr(""), "name");
	    if (!resource.getAttribute("userData")) resource.registerAttribute(new StringAttr(""), "userData");
	}
	
	// register resource
	if (this.registry)
	{
	    this.registry.register(resource);
	    resource.setRegistry(this.registry);   
	}
	
	// invoke post-register proc (if specified)
	
	return resource;
}

AttributeFactory.prototype.finalize = function(name, attribute)
{
    // invoke finalize proc
    var finalizeProc = this.finalizeProcs[name];
    if (finalizeProc)
    {
        finalizeProc(attribute, this);
    }
}

AttributeFactory.prototype.initializeNewResourceMap = function()
{
    // attributes
    this.newResourceProcs["Styles"] = newAttribute;
    this.newResourceProcs["StyleMap"] = newAttribute;
    this.newResourceProcs["StylesMap"] = newAttribute;
    this.newResourceProcs["LabelStyle"] = newAttribute;
    this.newResourceProcs["IconStyle"] = newAttribute;
    this.newResourceProcs["FontStyle"] = newAttribute;
    this.newResourceProcs["HTMLLabelStyle"] = newAttribute;
    this.newResourceProcs["BalloonTipLabelStyle"] = newAttribute;
    this.newResourceProcs["RenderableElementStyle"] = newAttribute;

    // nodes
    this.newResourceProcs["DirectionalLight"] = newSGNode;
    this.newResourceProcs["GlobalIllumination"] = newSGNode;
    this.newResourceProcs["Group"] = newSGNode;
    this.newResourceProcs["Isolator"] = newSGNode;
    this.newResourceProcs["Label"] = newSGNode;
    this.newResourceProcs["HTMLLabel"] = newSGNode;
    this.newResourceProcs["BalloonTipLabel"] = newSGNode;
    this.newResourceProcs["LineList"] = newSGNode;
    this.newResourceProcs["MediaTexture"] = newSGNode;
    this.newResourceProcs["Model"] = newModel;
    this.newResourceProcs["OrthographicCamera"] = newSGNode;
    this.newResourceProcs["PerspectiveCamera"] = newSGNode;
    this.newResourceProcs["PointLight"] = newSGNode;
    this.newResourceProcs["PointList"] = newSGNode;
    this.newResourceProcs["QuaternionRotate"] = newSGNode;
    this.newResourceProcs["Rotate"] = newSGNode;
    this.newResourceProcs["Scale"] = newSGNode;
    this.newResourceProcs["Surface"] = newSGNode;
    this.newResourceProcs["Translate"] = newSGNode;
    this.newResourceProcs["TriList"] = newSGNode;
    this.newResourceProcs["NullObject"] = newSGNode;

    // directives
    this.newResourceProcs["BBoxDirective"] = newSGDirective;
    this.newResourceProcs["RayPickDirective"] = newSGDirective;
    this.newResourceProcs["RenderDirective"] = newSGDirective;
    this.newResourceProcs["SerializeDirective"] = newSGDirective;
    this.newResourceProcs["UpdateDirective"] = newSGDirective;

    // evaluators
    this.newResourceProcs["BBoxLocator"] = newBBoxLocator;
    this.newResourceProcs["KeyframeInterpolator"] = newKeyframeInterpolator;
    this.newResourceProcs["MapProjectionCalculator"] = newMapProjectionCalculator;
    this.newResourceProcs["ObjectInspector"] = newObjectInspector;
    this.newResourceProcs["SceneInspector"] = newSceneInspector;
    

    // commands
    this.newResourceProcs["AppendNode"] = newCommand;
    this.newResourceProcs["AutoInterpolate"] = newCommand;
    this.newResourceProcs["CommandSequence"] = newCommand;
    this.newResourceProcs["ConnectAttributes"] = newCommand;
    this.newResourceProcs["ConnectOutputs"] = newCommand;
    this.newResourceProcs["DisconnectAttributes"] = newCommand;
    this.newResourceProcs["DisconnectOutputs"] = newCommand;
    this.newResourceProcs["Locate"] = newCommand;
    this.newResourceProcs["MotionInterpolate"] = newCommand;
    this.newResourceProcs["Pause"] = newCommand;
    this.newResourceProcs["Play"] = newCommand;
    this.newResourceProcs["Remove"] = newCommand;
    this.newResourceProcs["Serialize"] = newCommand;
    this.newResourceProcs["Set"] = newCommand;
    this.newResourceProcs["Stop"] = newCommand;

    // device handlers
    this.newResourceProcs["MouseHandler"] = newDeviceHandler;
}

AttributeFactory.prototype.initializeConfigureMap = function()
{
    // nodes
    this.configureProcs["Model"] = configureModel;

    // directives
    this.configureProcs["BBoxDirective"] = configureDirective;
    this.configureProcs["RayPickDirective"] = configureDirective;
    this.configureProcs["RenderDirective"] = configureDirective;
    this.configureProcs["SerializeDirective"] = configureDirective;
    this.configureProcs["UpdateDirective"] = configureDirective;    
}

AttributeFactory.prototype.initializeFinalizeMap = function()
{
    // nodes
    this.finalizeProcs["Model"] = finalizeModel;

    // directives
    this.finalizeProcs["BBoxDirective"] = finalizeDirective;
    this.finalizeProcs["RayPickDirective"] = finalizeDirective;
    this.finalizeProcs["RenderDirective"] = finalizeDirective;
    this.finalizeProcs["SerializeDirective"] = finalizeDirective;
    this.finalizeProcs["UpdateDirective"] = finalizeDirective;

    // evaluators 
    this.finalizeProcs["KeyframeInterpolator"] = finalizeEvaluator;

    // commands
    this.finalizeProcs["AppendNode"] = finalizeCommand;
    this.finalizeProcs["AutoInterpolate"] = finalizeCommand;
    this.finalizeProcs["CommandSequence"] = finalizeCommand;
    this.finalizeProcs["ConnectAttributes"] = finalizeCommand;
    this.finalizeProcs["ConnectOutputs"] = finalizeCommand;
    this.finalizeProcs["DisconnectAttributes"] = finalizeCommand;
    this.finalizeProcs["DisconnectOutputs"] = finalizeCommand;
    this.finalizeProcs["Locate"] = finalizeCommand;
    this.finalizeProcs["MotionInterpolate"] = finalizeCommand;
    this.finalizeProcs["Pause"] = finalizeCommand;
    this.finalizeProcs["Play"] = finalizeCommand;
    this.finalizeProcs["Remove"] = finalizeCommand;
    this.finalizeProcs["Serialize"] = finalizeCommand;
    this.finalizeProcs["Set"] = finalizeCommand;
    this.finalizeProcs["Stop"] = finalizeCommand;

    // device handlers
    this.finalizeProcs["MouseHandler"] = finalizeDeviceHandler;
}

AttributeFactory.prototype.setRegistry = function(registry)
{
    this.registry = registry;
}

AttributeFactory.prototype.setGraphMgr = function(graphMgr)
{
    this.graphMgr = graphMgr;
}

function newAttribute(name, factory)
{
    var resource = null;
    
    switch (name)
    {
    case "Styles":                  resource = new StylesAttr(); break;
    case "StyleMap":                resource = new StyleMapAttr(); break;
    case "StylesMap":               resource = new StylesMapAttr(); break;
    case "LabelStyle":              resource = new LabelStyleAttr(); break;
    case "IconStyle":               resource = new IconStyleAttr(); break;
    case "FontStyle":               resource = new FontStyleAttr(); break;
    case "HTMLLabelStyle":          resource = new HTMLLabelStyleAttr(); break;
    case "BalloonTipLabelStyle":    resource = new BalloonTipLabelStyleAttr(); break;
    case "RenderableElementStyle":  resource = new RenderableElementStyleAttr(); break;
    }
    
    return resource;
}

function newSGNode(name, factory)
{
    var resource = null;
    
    switch (name)
    {
    case "DirectionalLight":    resource = new DirectionalLight(); registerParentableAttributes(resource, factory); break;
    case "GlobalIllumination":  resource = new GlobalIllumination(); break;
    case "Group":               resource = new Group(); break;
    case "Isolator":            resource = new Isolator(); break;
    case "Label":               resource = new Label(); break;
    case "HTMLLabel":           resource = new HTMLLabel(); break;
    case "BalloonTipLabel":     resource = new BalloonTipLabel(); break;
    case "LineList":            resource = new LineList(); break;
    case "MediaTexture":        resource = new MediaTexture(); break;
    case "OrthographicCamera":  resource = new OrthographicCamera(); registerParentableAttributes(resource, factory); break;
    case "PerspectiveCamera":   resource = new PerspectiveCamera(); registerParentableAttributes(resource, factory); break;
    case "PointLight":          resource = new PointLight(); registerParentableAttributes(resource, factory); break;
    case "PointList":           resource = new PointList(); break;
    case "QuaternionRotate":    resource = new QuaternionRotate(); break;
    case "Rotate":              resource = new Rotate(); break;
    case "Scale":               resource = new Scale(); break;
    case "Surface":             resource = new Surface(); break;
    case "Transform":           resource = new Transform(); break;
    case "Translate":           resource = new Translate(); break;
    case "TriList":             resource = new TriList(); break;
    case "NullObject":          resource = new NullObject(); registerParentableAttributes(resource, factory);  break; 
    }
    
    if (resource)
    {
        resource.setGraphMgr(factory.graphMgr);
    }
    
    return resource;
}

function newSGDirective(name, factory)
{
    var resource = null;
    
    switch (name)
    {
    case "BBoxDirective":       resource = new BBoxDirective(); break;
    case "RayPickDirective":    resource = new RayPickDirective(); break;
    case "RenderDirective":     resource = new RenderDirective(); break;  
    case "SerializeDirective":  resource = new SerializeDirective(); break;
    case "UpdateDirective":     resource = new UpdateDirective(); break;
    }
    
    if (resource)
    {
        resource.setGraphMgr(factory.graphMgr);
    }
    
    return resource;
}

function newModel(name, factory)
{
    var resource = new Model();
    resource.setGraphMgr(factory.graphMgr);
    registerParentableAttributes(resource, factory);
    return resource;
}

function newBBoxLocator(name, factory)
{
    var resource = new BBoxLocator();

    registerEvaluatorAttributes(resource, factory);

    return resource;
}

function newKeyframeInterpolator(name, factory)
{
    var resource = new KeyframeInterpolator();
    
    registerEvaluatorAttributes(resource, factory);
    
    return resource;
}

function newMapProjectionCalculator(name, factory)
{
    var resource = new MapProjectionCalculator();

    registerEvaluatorAttributes(resource, factory);

    return resource;
}

function newObjectInspector(name, factory)
{
    var resource = new ObjectInspector();
    
    registerEvaluatorAttributes(resource, factory);
    
    // target the Inspector's selection flag with the selector's clickPoint
    var selector = factory.registry.find("Selector");
    if (selector)
    {
        selector.getAttribute("selectionOccurred").addTarget(
            resource.getAttribute("selectionOccurred"), eAttrSetOp.Replace, null, false);
            
        selector.getAttribute("selectionCleared").addTarget(
            resource.getAttribute("selectionCleared"), eAttrSetOp.Replace, null, false);
    }
    
    return resource;
}

function newSceneInspector(name, factory)
{
    var resource = new BwSceneInspector();
    
    registerEvaluatorAttributes(resource, factory);
   
    // target the Inspector's selection flag with the selector's clickPoint
    // target the Inspector's pivotDistance with the selector's distanceFromScreenCenter
    var selector = factory.registry.find("Selector");
    if (selector)
    {
        selector.getAttribute("selectionOccurred").addTarget(
            resource.getAttribute("selectionOccurred"), eAttrSetOp.Replace, null, false);
            
        selector.getAttribute("distanceFromScreenCenter").addTarget(
            resource.getAttribute("pivotDistance"), eAttrSetOp.Replace, null, false);
    }
     
    return resource;
}

function newCommand(name, factory)
{
    var resource = null;
    
    switch (name)
    {
    case "AppendNode":     	    resource = new AppendNodeCommand(); break;
    case "AutoInterpolate":     resource = new AutoInterpolateCommand(); break;
    case "CommandSequence":     resource = new CommandSequence(); break;
    case "ConnectAttributes":   resource = new ConnectAttributesCommand(); break;
    case "ConnectOutputs":      resource = new ConnectAttributesCommand(); break;    
    case "DisconnectAttributes":resource = new ConnectAttributesCommand(); resource.getAttribute("negate").setValueDirect(true); break;
    case "DisconnectOutputs":   resource = new ConnectAttributesCommand(); resource.getAttribute("negate").setValueDirect(true); break;
    case "Locate":              resource = new LocateCommand(); break;
    case "MotionInterpolate":   resource = new MotionInterpolateCommand(); break;
    case "Pause":               resource = new PlayCommand(); resource.getAttribute("negate").setValueDirect(true); break;
    case "Play":                resource = new PlayCommand(); break;
    case "Remove":              resource = new RemoveCommand(); break;
    case "Serialize":           resource = new SerializeCommand(); break;
    case "Set":                 resource = new SetCommand(); break;
    case "Stop":                resource = new StopCommand(); break;
    }

	// if command sequence, set to command mgr
	if (name == "CommandSequence")
	{
	    var commandMgr = factory.registry.find("CommandMgr");
	    if (commandMgr)
	    {
	        commandMgr.pushCommandSequence(resource);
	    }    
	}
	
	return resource;
}

function newDeviceHandler(name, factory)
{
    var resource = null;
    
    switch (name)
    {
    case "MouseHandler":        resource = new MouseHandler(); break;
    }
	
	return resource;
}

function configureModel(model, factory)
{
    // TODO
    console.debug("TODO: " + arguments.callee.name);
}

function configureDirective(directive, factory)
{
    var root = new StringAttr("");
    root.addModifiedCB(AttributeFactory_DirectiveRootModifiedCB, factory);
    directive.registerAttribute(root, "root");
    
    var rootNode = factory.registry.getAttribute("rootPtr").getValueDirect();
    if (rootNode)
    {
        root.setValueDirect(rootNode.getAttribute("name").getValueDirect().join(""));
    }
}

function finalizeModel(model, factory)
{
    // TODO
    console.debug("TODO: remove LWO assumption");
    
    var url = model.getAttribute("url").getValueDirect();
    if (url) {
        
        url = url.join("");
        
        var pathInfo = formatPath(url);
        console.debug("path: " + pathInfo[0]);
        console.debug("content dir: " + pathInfo[1]);
        
        var contentHandler = new LWObjectHandler();
        contentHandler.getAttribute("contentDirectory").setValueDirect(pathInfo[1]);

        var contentBuilder = new LWObjectBuilder(); 
        contentBuilder.setRegistry(factory.registry);
        contentBuilder.models.push(model);
        contentBuilder.layer = model.getAttribute("layer").getValueDirect();
        contentBuilder.visitHandler(contentHandler);
        
        contentHandler.parseFileStream(pathInfo[0]);  
    }
    
    addInspectionGroup(model, factory);
}

function finalizeDirective(directive, factory)
{
}

function finalizeCommand(command, factory)
{
    var commandMgr = factory.registry.find("CommandMgr");
    if (commandMgr)
    {
        // if command sequence, clear from command mgr
        if (command.className == "CommandSequence")
        {
            commandMgr.popCommandSequence();
        }
        
        commandMgr.addCommand(command);
    }
}

function finalizeDeviceHandler(handler, factory)
{
    var eventMgr = factory.registry.find("EventMgr");
    if (eventMgr)
    {
        var events = handler.getEventTypes();
        for (var i=0; i < events.length; i++)
        {
            eventMgr.addListener(events[i], handler);
        }
    }
}

function finalizeEvaluator(evaluator, factory)
{
    // TODO
    console.debug("TODO: " + arguments.callee.name);
    
    switch (evaluator.className)
    {
    case "KeyframeInterpolator":
        
        var url = evaluator.getAttribute("url").getValueDirect();
        if (url) {
        
            url = url.join("");
            
            var pathInfo = formatPath(url);
            
            var contentHandler = new LWSceneHandler();
            contentHandler.getAttribute("contentDirectory").setValueDirect(pathInfo[1]);
            
            var contentBuilder = new LWSceneBuilder(); 
            contentBuilder.setRegistry(factory.registry);
            contentBuilder.evaluators.push(evaluator);
            contentBuilder.visitHandler(contentHandler);
            
            contentHandler.parseFileStream(pathInfo[0]); 
        }
        AttributeFactory_EvaluatorTargetConnectionTypeModifiedCB(evaluator.getAttribute("targetConnectionType"), factory);
        break;
    }
}

function registerEvaluatorAttributes(evaluator, factory)
{
    // url
    var url = new StringAttr("");
    evaluator.registerAttribute(url, "url");

    // target
    var target = new StringAttr("");
    evaluator.registerAttribute(target, "target");

    // renderAndRelease
    var renderAndRelease = new BooleanAttr(false);
    evaluator.registerAttribute(renderAndRelease, "renderAndRelease");
	
    // targetConnectionType
    var targetConnectionType = new StringAttr("transform");
    targetConnectionType.addModifiedCB(AttributeFactory_EvaluatorTargetConnectionTypeModifiedCB, factory);
    evaluator.registerAttribute(targetConnectionType, "targetConnectionType");
}

function registerParentableAttributes(pme, factory)
{
    // label
	var label = new StringAttr("");
	pme.registerAttribute(label, "label");
	label.addModifiedCB(AttributeFactory_ParentableLabelModifiedCB, factory);
	
	// geoPosition
	var geoPosition = new Vector3DAttr();
	pme.registerAttribute(geoPosition, "geoPosition");
	geoPosition.addModifiedCB(AttributeFactory_ParentableGeoPositionModifiedCB, factory);

	// altitude
	var altitude = new NumberAttr();
	pme.registerAttribute(altitude, "altitude");

	// latitude
	var latitude = new NumberAttr();
	pme.registerAttribute(latitude, "latitude");

	// longitude
	var longitude = new NumberAttr();
	pme.registerAttribute(longitude, "longitude");

	// misc modified callbacks
	pme.getAttribute("worldCenter").addModifiedCB(AttributeFactory_ParentableWorldPositionModifiedCB, factory);
}

function getSceneGraph()
{
    return this.sceneGraph;
}

function AttributeFactory_DirectiveRootModifiedCB(root, factory)
{
    var directive = root.getContainer();
    var resources = factory.registry.getByName(root.getValueDirect().join(""));
    if (resources)
    {
        directive.getAttribute("rootNode").setValueDirect(resources[0]);
    }
}

function AttributeFactory_ParentableLabelModifiedCB(attribute, container)
{
    console.debug("TODO: " + arguments.callee.name);
}

function AttributeFactory_ParentableGeoPositionModifiedCB(attribute, container)
{
    var pme = attribute.getContainer();
    if (pme)
    {
        var cms = container.registry.getByName("ConnectionMgr");
        if (cms && cms.length)
        {
            var cm = cms[0];
            
            var mpcs = container.registry.getByType(eAttrType.MapProjectionCalculator);
            if (mpcs && mpcs.length)
            {
                var mpc = mpcs[0];

                mpc.getAttribute("geoPosition").copyValue(attribute);

                cm.connectMapProjectionCalculator(mpc, pme);
                cm.disconnectMapProjectionCalculator(mpc, pme);
            }
        }
    }
}

function AttributeFactory_ParentableWorldPositionModifiedCB(attribute, container)
{
    // TODO
    //console.debug("TODO: " + arguments.callee.name);
}

function AttributeFactory_EvaluatorTargetConnectionTypeModifiedCB(attribute, container)
{  
    var evaluator = attribute.getContainer();
    if (evaluator)
    {
        var connect = new ConnectAttributesCommand();
        connect.setRegistry(container.registry);
        connect.getAttribute("sourceContainer").copyValue(evaluator.getAttribute("name"));
        connect.getAttribute("targetContainer").copyValue(evaluator.getAttribute("target"));
        connect.getAttribute("connectionType").copyValue(attribute);
        connect.execute();
    }
}
Bridgeworks.prototype = new AttributeContainer();
Bridgeworks.prototype.constructor = Bridgeworks;

function Bridgeworks(canvas, bgImage, contentDir)
{
    AttributeContainer.call(this);
    this.className = "Bridgeworks";
    
    this.renderContext =  newRenderContext("webgl", canvas, bgImage);
    if (!this.renderContext) return;

    contentDir = contentDir == null? "BwContent" : contentDir;

    this.canvas = canvas;
    this.contentDir = contentDir;
    
    // allocate objects
    //this.renderContext = null;
    this.graphMgr = new GraphMgr();
    this.graphMgr.setRenderContext(this.renderContext)
    
    this.styleMgr = new StyleMgr();
    this.registry = new BwRegistry();
    this.factory = new AttributeFactory();
    this.parser = new XMLParser(this.factory, this.registry, this.contentDir);
    this.eventAdapter = new EventAdapter();
    this.eventMgr = new EventMgr();
    this.commandMgr = new CommandMgr();
    this.connectionMgr = new ConnectionMgr();
    this.viewportMgr = new ViewportMgr();
    this.selector = new SelectionListener();
    this.rayPick = new RayPickDirective();
    this.renderAgent = new RenderAgent(this);
    this.renderController = new RenderController(this);
    this.layout = new GridLayout();
    this.mapProjectionCalculator = new MapProjectionCalculator();
    this.rasterComponentEventListener = new RasterComponentEventListener();
     
    // set registry to allocated objects
    this.graphMgr.setRegistry(this.registry);
    this.factory.setRegistry(this.registry);
    this.eventAdapter.setRegistry(this.registry);
    this.eventMgr.setRegistry(this.registry);
    this.commandMgr.setRegistry(this.registry);
    this.connectionMgr.setRegistry(this.registry);
    this.viewportMgr.setRegistry(this.registry);
    this.selector.setRegistry(this.registry);
    this.renderAgent.setRegistry(this.registry);
    this.layout.setRegistry(this.registry);
    
    // configure dependencies
    this.factory.setGraphMgr(this.graphMgr);
    this.selector.setRayPick(this.rayPick);
    this.rasterComponentEventListener.setStyleMgr(this.styleMgr);
    this.rasterComponents = null;
    
    this.name = new StringAttr("Bridgeworks");
    this.onLoad = new StringAttr();
    
    this.onLoad.addModifiedCB(Bridgeworks_OnLoadModifiedCB, this);
    
    this.registerAttribute(this.name, "name");
    this.registerAttribute(this.onLoad, "onLoad");
    
    this.viewportMgr.getAttribute("width").setValueDirect(this.canvas.width);
    this.viewportMgr.getAttribute("height").setValueDirect(this.canvas.height);    
    this.viewportMgr.getAttribute("layout").setValueDirect(this.layout);
    
    enumerateAttributeTypes();
    enumerateAttributeElementTypes();
    
    // TODO: remove the following when onLoadModified is defined
    console.debug("TODO: " + arguments.callee.name);
    this.initRegistry();
    this.initEventListeners();
    this.viewportMgr.initLayout();
}

Bridgeworks.prototype.handleEvent = function(event)
{
    var bwEvent = null;

    switch (getObjectClassName(event))
    {
        case "MouseEvent":
            {
                var absPos = getElementAbsolutePos(this.canvas);            
                event.canvasX = event.clientX - absPos.x;
                event.canvasY = event.clientY - absPos.y;
                bwEvent = this.eventAdapter.createMouseEvent(event);
            }
            break;
        case "KeyboardEvent":
            {
                bwEvent = this.eventAdapter.createKeyboardEvent(event);
            }
            break;
    }

    if (bwEvent)
    {
        this.eventMgr.processEvent(bwEvent);
    }
}

Bridgeworks.prototype.initRegistry = function()
{
    // register allocated objects
    this.registry.register(this);
    this.registry.register(this.graphMgr);
    this.registry.register(this.factory);
    this.registry.register(this.eventAdapter);
    this.registry.register(this.eventMgr);
    this.registry.register(this.commandMgr);
    this.registry.register(this.connectionMgr);
    this.registry.register(this.viewportMgr);
    this.registry.register(this.selector);
    this.registry.register(this.renderAgent);
    this.registry.register(this.layout);
    this.registry.register(this.mapProjectionCalculator);

    // backward compatibility
    this.registry.registerByName(this.renderAgent, "AnimationAgent");
}

Bridgeworks.prototype.initEventListeners = function()
{
    // selector
    this.eventMgr.addListener(eEventType.MouseLeftDown, this.selector);
    this.eventMgr.addListener(eEventType.MouseMiddleDown, this.selector);
    this.eventMgr.addListener(eEventType.MouseRightDown, this.selector);
    this.eventMgr.addListener(eEventType.MouseBothDown, this.selector);
    this.eventMgr.addListener(eEventType.MouseHover, this.selector);
    //this.eventMgr.addListener(eMOUSE_MOVE, this.selector);

    // raster component event listener
    this.eventMgr.addListener(eEventType.MouseLeftDown, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseLeftUp, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseLeftClick, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseLeftDblClick, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseMiddleDown, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseMiddleUp, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseMiddleClick, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseMiddleDblClick, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseRightDown, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseRightUp, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseRightClick, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseRightDblClick, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseWheelDown, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseWheelUp, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseBothDown, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseHover, this.rasterComponentEventListener);
    this.eventMgr.addListener(eEventType.MouseMove, this.rasterComponentEventListener);    
}

Bridgeworks.prototype.onLoadModified = function()
{
    this.renderAgent.stop();
    //this.iscetAgent.stop(); There is no isectAgent in javascript version
    this.selector.stop();
    this.rasterComponentEventListener.stop();

    this.commandMgr.clearCommandSequence();
    this.eventMgr.clearEvents();
    $('#RasterComponents').empty();
    //this.resouceMgr.clear(); There is no resourceMgr in javascript version
    this.selector.clearSelections();
    this.selector.getAttribute("lastSelectedName").setValueDirect("");
    this.viewportMgr.initLayout();
/*    std::map<std::string, std::pair<CAttribute*, CAttribute*> >::const_iterator it;
 for (it = m_messageSinks.begin(); it != m_messageSinks.end(); it++)
 {
 it->second.first->AddRef();
 it->second.second->AddRef();
 }*/

    this.registry.clear();
    this.initEventListeners();
    this.initRegistry();

    /*	for (it = m_messageSinks.begin(); it != m_messageSinks.end(); it++)
     {
     std::string data_name(it->first.c_str());
     data_name += "_data";

     dynamic_cast<AttributeRegistry*>(registry)->Register(it->second.first, it->first.c_str());
     it->second.first->Release();
     dynamic_cast<AttributeRegistry*>(registry)->Register(it->second.second, data_name.c_str());
     it->second.second->Release();
     }*/

    this.renderAgent.getAttribute("globalTimeInSecs").setValueDirect(0);

    this.graphMgr.reset();

    this.renderAgent.start();
    //this.iscetAgent.start(); There is no isectAgent in javascript version
    this.selector.start();
    this.rasterComponentEventListener.start();


    // TODO
    console.debug("TODO: " + arguments.callee.name);
}

Bridgeworks.prototype.resize = function(width, height)
{
    this.canvas.width = width;
    this.canvas.height = height;
    this.renderContext.setViewport(this.canvas.offsetLeft, this.canvas.offsetTop, width, height);

    this.viewportMgr.getAttribute("width").setValueDirect(width);
    this.viewportMgr.getAttribute("height").setValueDirect(height);
}

Bridgeworks.prototype.render = function()
{
    this.renderContext.clear();
    this.renderAgent.render();
}

Bridgeworks.prototype.setRenderContext = function(rc)
{
    this.renderContext = rc;
    this.graphMgr.setRenderContext(rc);
}

Bridgeworks.prototype.updateScene = function(xml)
{
    var xmlString = new String(xml);
    var extension = xmlString.substr(xmlString.length - 3, 3);
    if (extension == "xml")
    {
        xml = loadXMLResource(this.contentDir + "/" + xml);
    }

    this.parser.parse(xml);
}

function Bridgeworks_OnLoadModifiedCB(attribute, container)
{
    container.onLoadModified();
}
/*
 * jQuery JavaScript Library v1.3.2
 * http://jquery.com/
 *
 * Copyright (c) 2009 John Resig
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-02-19 17:34:21 -0500 (Thu, 19 Feb 2009)
 * Revision: 6246
 */
(function(){var l=this,g,y=l.jQuery,p=l.$,o=l.jQuery=l.$=function(E,F){return new o.fn.init(E,F)},D=/^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,f=/^.[^:#\[\.,]*$/;o.fn=o.prototype={init:function(E,H){E=E||document;if(E.nodeType){this[0]=E;this.length=1;this.context=E;return this}if(typeof E==="string"){var G=D.exec(E);if(G&&(G[1]||!H)){if(G[1]){E=o.clean([G[1]],H)}else{var I=document.getElementById(G[3]);if(I&&I.id!=G[3]){return o().find(E)}var F=o(I||[]);F.context=document;F.selector=E;return F}}else{return o(H).find(E)}}else{if(o.isFunction(E)){return o(document).ready(E)}}if(E.selector&&E.context){this.selector=E.selector;this.context=E.context}return this.setArray(o.isArray(E)?E:o.makeArray(E))},selector:"",jquery:"1.3.2",size:function(){return this.length},get:function(E){return E===g?Array.prototype.slice.call(this):this[E]},pushStack:function(F,H,E){var G=o(F);G.prevObject=this;G.context=this.context;if(H==="find"){G.selector=this.selector+(this.selector?" ":"")+E}else{if(H){G.selector=this.selector+"."+H+"("+E+")"}}return G},setArray:function(E){this.length=0;Array.prototype.push.apply(this,E);return this},each:function(F,E){return o.each(this,F,E)},index:function(E){return o.inArray(E&&E.jquery?E[0]:E,this)},attr:function(F,H,G){var E=F;if(typeof F==="string"){if(H===g){return this[0]&&o[G||"attr"](this[0],F)}else{E={};E[F]=H}}return this.each(function(I){for(F in E){o.attr(G?this.style:this,F,o.prop(this,E[F],G,I,F))}})},css:function(E,F){if((E=="width"||E=="height")&&parseFloat(F)<0){F=g}return this.attr(E,F,"curCSS")},text:function(F){if(typeof F!=="object"&&F!=null){return this.empty().append((this[0]&&this[0].ownerDocument||document).createTextNode(F))}var E="";o.each(F||this,function(){o.each(this.childNodes,function(){if(this.nodeType!=8){E+=this.nodeType!=1?this.nodeValue:o.fn.text([this])}})});return E},wrapAll:function(E){if(this[0]){var F=o(E,this[0].ownerDocument).clone();if(this[0].parentNode){F.insertBefore(this[0])}F.map(function(){var G=this;while(G.firstChild){G=G.firstChild}return G}).append(this)}return this},wrapInner:function(E){return this.each(function(){o(this).contents().wrapAll(E)})},wrap:function(E){return this.each(function(){o(this).wrapAll(E)})},append:function(){return this.domManip(arguments,true,function(E){if(this.nodeType==1){this.appendChild(E)}})},prepend:function(){return this.domManip(arguments,true,function(E){if(this.nodeType==1){this.insertBefore(E,this.firstChild)}})},before:function(){return this.domManip(arguments,false,function(E){this.parentNode.insertBefore(E,this)})},after:function(){return this.domManip(arguments,false,function(E){this.parentNode.insertBefore(E,this.nextSibling)})},end:function(){return this.prevObject||o([])},push:[].push,sort:[].sort,splice:[].splice,find:function(E){if(this.length===1){var F=this.pushStack([],"find",E);F.length=0;o.find(E,this[0],F);return F}else{return this.pushStack(o.unique(o.map(this,function(G){return o.find(E,G)})),"find",E)}},clone:function(G){var E=this.map(function(){if(!o.support.noCloneEvent&&!o.isXMLDoc(this)){var I=this.outerHTML;if(!I){var J=this.ownerDocument.createElement("div");J.appendChild(this.cloneNode(true));I=J.innerHTML}return o.clean([I.replace(/ jQuery\d+="(?:\d+|null)"/g,"").replace(/^\s*/,"")])[0]}else{return this.cloneNode(true)}});if(G===true){var H=this.find("*").andSelf(),F=0;E.find("*").andSelf().each(function(){if(this.nodeName!==H[F].nodeName){return}var I=o.data(H[F],"events");for(var K in I){for(var J in I[K]){o.event.add(this,K,I[K][J],I[K][J].data)}}F++})}return E},filter:function(E){return this.pushStack(o.isFunction(E)&&o.grep(this,function(G,F){return E.call(G,F)})||o.multiFilter(E,o.grep(this,function(F){return F.nodeType===1})),"filter",E)},closest:function(E){var G=o.expr.match.POS.test(E)?o(E):null,F=0;return this.map(function(){var H=this;while(H&&H.ownerDocument){if(G?G.index(H)>-1:o(H).is(E)){o.data(H,"closest",F);return H}H=H.parentNode;F++}})},not:function(E){if(typeof E==="string"){if(f.test(E)){return this.pushStack(o.multiFilter(E,this,true),"not",E)}else{E=o.multiFilter(E,this)}}var F=E.length&&E[E.length-1]!==g&&!E.nodeType;return this.filter(function(){return F?o.inArray(this,E)<0:this!=E})},add:function(E){return this.pushStack(o.unique(o.merge(this.get(),typeof E==="string"?o(E):o.makeArray(E))))},is:function(E){return !!E&&o.multiFilter(E,this).length>0},hasClass:function(E){return !!E&&this.is("."+E)},val:function(K){if(K===g){var E=this[0];if(E){if(o.nodeName(E,"option")){return(E.attributes.value||{}).specified?E.value:E.text}if(o.nodeName(E,"select")){var I=E.selectedIndex,L=[],M=E.options,H=E.type=="select-one";if(I<0){return null}for(var F=H?I:0,J=H?I+1:M.length;F<J;F++){var G=M[F];if(G.selected){K=o(G).val();if(H){return K}L.push(K)}}return L}return(E.value||"").replace(/\r/g,"")}return g}if(typeof K==="number"){K+=""}return this.each(function(){if(this.nodeType!=1){return}if(o.isArray(K)&&/radio|checkbox/.test(this.type)){this.checked=(o.inArray(this.value,K)>=0||o.inArray(this.name,K)>=0)}else{if(o.nodeName(this,"select")){var N=o.makeArray(K);o("option",this).each(function(){this.selected=(o.inArray(this.value,N)>=0||o.inArray(this.text,N)>=0)});if(!N.length){this.selectedIndex=-1}}else{this.value=K}}})},html:function(E){return E===g?(this[0]?this[0].innerHTML.replace(/ jQuery\d+="(?:\d+|null)"/g,""):null):this.empty().append(E)},replaceWith:function(E){return this.after(E).remove()},eq:function(E){return this.slice(E,+E+1)},slice:function(){return this.pushStack(Array.prototype.slice.apply(this,arguments),"slice",Array.prototype.slice.call(arguments).join(","))},map:function(E){return this.pushStack(o.map(this,function(G,F){return E.call(G,F,G)}))},andSelf:function(){return this.add(this.prevObject)},domManip:function(J,M,L){if(this[0]){var I=(this[0].ownerDocument||this[0]).createDocumentFragment(),F=o.clean(J,(this[0].ownerDocument||this[0]),I),H=I.firstChild;if(H){for(var G=0,E=this.length;G<E;G++){L.call(K(this[G],H),this.length>1||G>0?I.cloneNode(true):I)}}if(F){o.each(F,z)}}return this;function K(N,O){return M&&o.nodeName(N,"table")&&o.nodeName(O,"tr")?(N.getElementsByTagName("tbody")[0]||N.appendChild(N.ownerDocument.createElement("tbody"))):N}}};o.fn.init.prototype=o.fn;function z(E,F){if(F.src){o.ajax({url:F.src,async:false,dataType:"script"})}else{o.globalEval(F.text||F.textContent||F.innerHTML||"")}if(F.parentNode){F.parentNode.removeChild(F)}}function e(){return +new Date}o.extend=o.fn.extend=function(){var J=arguments[0]||{},H=1,I=arguments.length,E=false,G;if(typeof J==="boolean"){E=J;J=arguments[1]||{};H=2}if(typeof J!=="object"&&!o.isFunction(J)){J={}}if(I==H){J=this;--H}for(;H<I;H++){if((G=arguments[H])!=null){for(var F in G){var K=J[F],L=G[F];if(J===L){continue}if(E&&L&&typeof L==="object"&&!L.nodeType){J[F]=o.extend(E,K||(L.length!=null?[]:{}),L)}else{if(L!==g){J[F]=L}}}}}return J};var b=/z-?index|font-?weight|opacity|zoom|line-?height/i,q=document.defaultView||{},s=Object.prototype.toString;o.extend({noConflict:function(E){l.$=p;if(E){l.jQuery=y}return o},isFunction:function(E){return s.call(E)==="[object Function]"},isArray:function(E){return s.call(E)==="[object Array]"},isXMLDoc:function(E){return E.nodeType===9&&E.documentElement.nodeName!=="HTML"||!!E.ownerDocument&&o.isXMLDoc(E.ownerDocument)},globalEval:function(G){if(G&&/\S/.test(G)){var F=document.getElementsByTagName("head")[0]||document.documentElement,E=document.createElement("script");E.type="text/javascript";if(o.support.scriptEval){E.appendChild(document.createTextNode(G))}else{E.text=G}F.insertBefore(E,F.firstChild);F.removeChild(E)}},nodeName:function(F,E){return F.nodeName&&F.nodeName.toUpperCase()==E.toUpperCase()},each:function(G,K,F){var E,H=0,I=G.length;if(F){if(I===g){for(E in G){if(K.apply(G[E],F)===false){break}}}else{for(;H<I;){if(K.apply(G[H++],F)===false){break}}}}else{if(I===g){for(E in G){if(K.call(G[E],E,G[E])===false){break}}}else{for(var J=G[0];H<I&&K.call(J,H,J)!==false;J=G[++H]){}}}return G},prop:function(H,I,G,F,E){if(o.isFunction(I)){I=I.call(H,F)}return typeof I==="number"&&G=="curCSS"&&!b.test(E)?I+"px":I},className:{add:function(E,F){o.each((F||"").split(/\s+/),function(G,H){if(E.nodeType==1&&!o.className.has(E.className,H)){E.className+=(E.className?" ":"")+H}})},remove:function(E,F){if(E.nodeType==1){E.className=F!==g?o.grep(E.className.split(/\s+/),function(G){return !o.className.has(F,G)}).join(" "):""}},has:function(F,E){return F&&o.inArray(E,(F.className||F).toString().split(/\s+/))>-1}},swap:function(H,G,I){var E={};for(var F in G){E[F]=H.style[F];H.style[F]=G[F]}I.call(H);for(var F in G){H.style[F]=E[F]}},css:function(H,F,J,E){if(F=="width"||F=="height"){var L,G={position:"absolute",visibility:"hidden",display:"block"},K=F=="width"?["Left","Right"]:["Top","Bottom"];function I(){L=F=="width"?H.offsetWidth:H.offsetHeight;if(E==="border"){return}o.each(K,function(){if(!E){L-=parseFloat(o.curCSS(H,"padding"+this,true))||0}if(E==="margin"){L+=parseFloat(o.curCSS(H,"margin"+this,true))||0}else{L-=parseFloat(o.curCSS(H,"border"+this+"Width",true))||0}})}if(H.offsetWidth!==0){I()}else{o.swap(H,G,I)}return Math.max(0,Math.round(L))}return o.curCSS(H,F,J)},curCSS:function(I,F,G){var L,E=I.style;if(F=="opacity"&&!o.support.opacity){L=o.attr(E,"opacity");return L==""?"1":L}if(F.match(/float/i)){F=w}if(!G&&E&&E[F]){L=E[F]}else{if(q.getComputedStyle){if(F.match(/float/i)){F="float"}F=F.replace(/([A-Z])/g,"-$1").toLowerCase();var M=q.getComputedStyle(I,null);if(M){L=M.getPropertyValue(F)}if(F=="opacity"&&L==""){L="1"}}else{if(I.currentStyle){var J=F.replace(/\-(\w)/g,function(N,O){return O.toUpperCase()});L=I.currentStyle[F]||I.currentStyle[J];if(!/^\d+(px)?$/i.test(L)&&/^\d/.test(L)){var H=E.left,K=I.runtimeStyle.left;I.runtimeStyle.left=I.currentStyle.left;E.left=L||0;L=E.pixelLeft+"px";E.left=H;I.runtimeStyle.left=K}}}}return L},clean:function(F,K,I){K=K||document;if(typeof K.createElement==="undefined"){K=K.ownerDocument||K[0]&&K[0].ownerDocument||document}if(!I&&F.length===1&&typeof F[0]==="string"){var H=/^<(\w+)\s*\/?>$/.exec(F[0]);if(H){return[K.createElement(H[1])]}}var G=[],E=[],L=K.createElement("div");o.each(F,function(P,S){if(typeof S==="number"){S+=""}if(!S){return}if(typeof S==="string"){S=S.replace(/(<(\w+)[^>]*?)\/>/g,function(U,V,T){return T.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i)?U:V+"></"+T+">"});var O=S.replace(/^\s+/,"").substring(0,10).toLowerCase();var Q=!O.indexOf("<opt")&&[1,"<select multiple='multiple'>","</select>"]||!O.indexOf("<leg")&&[1,"<fieldset>","</fieldset>"]||O.match(/^<(thead|tbody|tfoot|colg|cap)/)&&[1,"<table>","</table>"]||!O.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!O.indexOf("<td")||!O.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||!O.indexOf("<col")&&[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"]||!o.support.htmlSerialize&&[1,"div<div>","</div>"]||[0,"",""];L.innerHTML=Q[1]+S+Q[2];while(Q[0]--){L=L.lastChild}if(!o.support.tbody){var R=/<tbody/i.test(S),N=!O.indexOf("<table")&&!R?L.firstChild&&L.firstChild.childNodes:Q[1]=="<table>"&&!R?L.childNodes:[];for(var M=N.length-1;M>=0;--M){if(o.nodeName(N[M],"tbody")&&!N[M].childNodes.length){N[M].parentNode.removeChild(N[M])}}}if(!o.support.leadingWhitespace&&/^\s/.test(S)){L.insertBefore(K.createTextNode(S.match(/^\s*/)[0]),L.firstChild)}S=o.makeArray(L.childNodes)}if(S.nodeType){G.push(S)}else{G=o.merge(G,S)}});if(I){for(var J=0;G[J];J++){if(o.nodeName(G[J],"script")&&(!G[J].type||G[J].type.toLowerCase()==="text/javascript")){E.push(G[J].parentNode?G[J].parentNode.removeChild(G[J]):G[J])}else{if(G[J].nodeType===1){G.splice.apply(G,[J+1,0].concat(o.makeArray(G[J].getElementsByTagName("script"))))}I.appendChild(G[J])}}return E}return G},attr:function(J,G,K){if(!J||J.nodeType==3||J.nodeType==8){return g}var H=!o.isXMLDoc(J),L=K!==g;G=H&&o.props[G]||G;if(J.tagName){var F=/href|src|style/.test(G);if(G=="selected"&&J.parentNode){J.parentNode.selectedIndex}if(G in J&&H&&!F){if(L){if(G=="type"&&o.nodeName(J,"input")&&J.parentNode){throw"type property can't be changed"}J[G]=K}if(o.nodeName(J,"form")&&J.getAttributeNode(G)){return J.getAttributeNode(G).nodeValue}if(G=="tabIndex"){var I=J.getAttributeNode("tabIndex");return I&&I.specified?I.value:J.nodeName.match(/(button|input|object|select|textarea)/i)?0:J.nodeName.match(/^(a|area)$/i)&&J.href?0:g}return J[G]}if(!o.support.style&&H&&G=="style"){return o.attr(J.style,"cssText",K)}if(L){J.setAttribute(G,""+K)}var E=!o.support.hrefNormalized&&H&&F?J.getAttribute(G,2):J.getAttribute(G);return E===null?g:E}if(!o.support.opacity&&G=="opacity"){if(L){J.zoom=1;J.filter=(J.filter||"").replace(/alpha\([^)]*\)/,"")+(parseInt(K)+""=="NaN"?"":"alpha(opacity="+K*100+")")}return J.filter&&J.filter.indexOf("opacity=")>=0?(parseFloat(J.filter.match(/opacity=([^)]*)/)[1])/100)+"":""}G=G.replace(/-([a-z])/ig,function(M,N){return N.toUpperCase()});if(L){J[G]=K}return J[G]},trim:function(E){return(E||"").replace(/^\s+|\s+$/g,"")},makeArray:function(G){var E=[];if(G!=null){var F=G.length;if(F==null||typeof G==="string"||o.isFunction(G)||G.setInterval){E[0]=G}else{while(F){E[--F]=G[F]}}}return E},inArray:function(G,H){for(var E=0,F=H.length;E<F;E++){if(H[E]===G){return E}}return -1},merge:function(H,E){var F=0,G,I=H.length;if(!o.support.getAll){while((G=E[F++])!=null){if(G.nodeType!=8){H[I++]=G}}}else{while((G=E[F++])!=null){H[I++]=G}}return H},unique:function(K){var F=[],E={};try{for(var G=0,H=K.length;G<H;G++){var J=o.data(K[G]);if(!E[J]){E[J]=true;F.push(K[G])}}}catch(I){F=K}return F},grep:function(F,J,E){var G=[];for(var H=0,I=F.length;H<I;H++){if(!E!=!J(F[H],H)){G.push(F[H])}}return G},map:function(E,J){var F=[];for(var G=0,H=E.length;G<H;G++){var I=J(E[G],G);if(I!=null){F[F.length]=I}}return F.concat.apply([],F)}});var C=navigator.userAgent.toLowerCase();o.browser={version:(C.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[0,"0"])[1],safari:/webkit/.test(C),opera:/opera/.test(C),msie:/msie/.test(C)&&!/opera/.test(C),mozilla:/mozilla/.test(C)&&!/(compatible|webkit)/.test(C)};o.each({parent:function(E){return E.parentNode},parents:function(E){return o.dir(E,"parentNode")},next:function(E){return o.nth(E,2,"nextSibling")},prev:function(E){return o.nth(E,2,"previousSibling")},nextAll:function(E){return o.dir(E,"nextSibling")},prevAll:function(E){return o.dir(E,"previousSibling")},siblings:function(E){return o.sibling(E.parentNode.firstChild,E)},children:function(E){return o.sibling(E.firstChild)},contents:function(E){return o.nodeName(E,"iframe")?E.contentDocument||E.contentWindow.document:o.makeArray(E.childNodes)}},function(E,F){o.fn[E]=function(G){var H=o.map(this,F);if(G&&typeof G=="string"){H=o.multiFilter(G,H)}return this.pushStack(o.unique(H),E,G)}});o.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(E,F){o.fn[E]=function(G){var J=[],L=o(G);for(var K=0,H=L.length;K<H;K++){var I=(K>0?this.clone(true):this).get();o.fn[F].apply(o(L[K]),I);J=J.concat(I)}return this.pushStack(J,E,G)}});o.each({removeAttr:function(E){o.attr(this,E,"");if(this.nodeType==1){this.removeAttribute(E)}},addClass:function(E){o.className.add(this,E)},removeClass:function(E){o.className.remove(this,E)},toggleClass:function(F,E){if(typeof E!=="boolean"){E=!o.className.has(this,F)}o.className[E?"add":"remove"](this,F)},remove:function(E){if(!E||o.filter(E,[this]).length){o("*",this).add([this]).each(function(){o.event.remove(this);o.removeData(this)});if(this.parentNode){this.parentNode.removeChild(this)}}},empty:function(){o(this).children().remove();while(this.firstChild){this.removeChild(this.firstChild)}}},function(E,F){o.fn[E]=function(){return this.each(F,arguments)}});function j(E,F){return E[0]&&parseInt(o.curCSS(E[0],F,true),10)||0}var h="jQuery"+e(),v=0,A={};o.extend({cache:{},data:function(F,E,G){F=F==l?A:F;var H=F[h];if(!H){H=F[h]=++v}if(E&&!o.cache[H]){o.cache[H]={}}if(G!==g){o.cache[H][E]=G}return E?o.cache[H][E]:H},removeData:function(F,E){F=F==l?A:F;var H=F[h];if(E){if(o.cache[H]){delete o.cache[H][E];E="";for(E in o.cache[H]){break}if(!E){o.removeData(F)}}}else{try{delete F[h]}catch(G){if(F.removeAttribute){F.removeAttribute(h)}}delete o.cache[H]}},queue:function(F,E,H){if(F){E=(E||"fx")+"queue";var G=o.data(F,E);if(!G||o.isArray(H)){G=o.data(F,E,o.makeArray(H))}else{if(H){G.push(H)}}}return G},dequeue:function(H,G){var E=o.queue(H,G),F=E.shift();if(!G||G==="fx"){F=E[0]}if(F!==g){F.call(H)}}});o.fn.extend({data:function(E,G){var H=E.split(".");H[1]=H[1]?"."+H[1]:"";if(G===g){var F=this.triggerHandler("getData"+H[1]+"!",[H[0]]);if(F===g&&this.length){F=o.data(this[0],E)}return F===g&&H[1]?this.data(H[0]):F}else{return this.trigger("setData"+H[1]+"!",[H[0],G]).each(function(){o.data(this,E,G)})}},removeData:function(E){return this.each(function(){o.removeData(this,E)})},queue:function(E,F){if(typeof E!=="string"){F=E;E="fx"}if(F===g){return o.queue(this[0],E)}return this.each(function(){var G=o.queue(this,E,F);if(E=="fx"&&G.length==1){G[0].call(this)}})},dequeue:function(E){return this.each(function(){o.dequeue(this,E)})}});
/*
 * Sizzle CSS Selector Engine - v0.9.3
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){var R=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,L=0,H=Object.prototype.toString;var F=function(Y,U,ab,ac){ab=ab||[];U=U||document;if(U.nodeType!==1&&U.nodeType!==9){return[]}if(!Y||typeof Y!=="string"){return ab}var Z=[],W,af,ai,T,ad,V,X=true;R.lastIndex=0;while((W=R.exec(Y))!==null){Z.push(W[1]);if(W[2]){V=RegExp.rightContext;break}}if(Z.length>1&&M.exec(Y)){if(Z.length===2&&I.relative[Z[0]]){af=J(Z[0]+Z[1],U)}else{af=I.relative[Z[0]]?[U]:F(Z.shift(),U);while(Z.length){Y=Z.shift();if(I.relative[Y]){Y+=Z.shift()}af=J(Y,af)}}}else{var ae=ac?{expr:Z.pop(),set:E(ac)}:F.find(Z.pop(),Z.length===1&&U.parentNode?U.parentNode:U,Q(U));af=F.filter(ae.expr,ae.set);if(Z.length>0){ai=E(af)}else{X=false}while(Z.length){var ah=Z.pop(),ag=ah;if(!I.relative[ah]){ah=""}else{ag=Z.pop()}if(ag==null){ag=U}I.relative[ah](ai,ag,Q(U))}}if(!ai){ai=af}if(!ai){throw"Syntax error, unrecognized expression: "+(ah||Y)}if(H.call(ai)==="[object Array]"){if(!X){ab.push.apply(ab,ai)}else{if(U.nodeType===1){for(var aa=0;ai[aa]!=null;aa++){if(ai[aa]&&(ai[aa]===true||ai[aa].nodeType===1&&K(U,ai[aa]))){ab.push(af[aa])}}}else{for(var aa=0;ai[aa]!=null;aa++){if(ai[aa]&&ai[aa].nodeType===1){ab.push(af[aa])}}}}}else{E(ai,ab)}if(V){F(V,U,ab,ac);if(G){hasDuplicate=false;ab.sort(G);if(hasDuplicate){for(var aa=1;aa<ab.length;aa++){if(ab[aa]===ab[aa-1]){ab.splice(aa--,1)}}}}}return ab};F.matches=function(T,U){return F(T,null,null,U)};F.find=function(aa,T,ab){var Z,X;if(!aa){return[]}for(var W=0,V=I.order.length;W<V;W++){var Y=I.order[W],X;if((X=I.match[Y].exec(aa))){var U=RegExp.leftContext;if(U.substr(U.length-1)!=="\\"){X[1]=(X[1]||"").replace(/\\/g,"");Z=I.find[Y](X,T,ab);if(Z!=null){aa=aa.replace(I.match[Y],"");break}}}}if(!Z){Z=T.getElementsByTagName("*")}return{set:Z,expr:aa}};F.filter=function(ad,ac,ag,W){var V=ad,ai=[],aa=ac,Y,T,Z=ac&&ac[0]&&Q(ac[0]);while(ad&&ac.length){for(var ab in I.filter){if((Y=I.match[ab].exec(ad))!=null){var U=I.filter[ab],ah,af;T=false;if(aa==ai){ai=[]}if(I.preFilter[ab]){Y=I.preFilter[ab](Y,aa,ag,ai,W,Z);if(!Y){T=ah=true}else{if(Y===true){continue}}}if(Y){for(var X=0;(af=aa[X])!=null;X++){if(af){ah=U(af,Y,X,aa);var ae=W^!!ah;if(ag&&ah!=null){if(ae){T=true}else{aa[X]=false}}else{if(ae){ai.push(af);T=true}}}}}if(ah!==g){if(!ag){aa=ai}ad=ad.replace(I.match[ab],"");if(!T){return[]}break}}}if(ad==V){if(T==null){throw"Syntax error, unrecognized expression: "+ad}else{break}}V=ad}return aa};var I=F.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(T){return T.getAttribute("href")}},relative:{"+":function(aa,T,Z){var X=typeof T==="string",ab=X&&!/\W/.test(T),Y=X&&!ab;if(ab&&!Z){T=T.toUpperCase()}for(var W=0,V=aa.length,U;W<V;W++){if((U=aa[W])){while((U=U.previousSibling)&&U.nodeType!==1){}aa[W]=Y||U&&U.nodeName===T?U||false:U===T}}if(Y){F.filter(T,aa,true)}},">":function(Z,U,aa){var X=typeof U==="string";if(X&&!/\W/.test(U)){U=aa?U:U.toUpperCase();for(var V=0,T=Z.length;V<T;V++){var Y=Z[V];if(Y){var W=Y.parentNode;Z[V]=W.nodeName===U?W:false}}}else{for(var V=0,T=Z.length;V<T;V++){var Y=Z[V];if(Y){Z[V]=X?Y.parentNode:Y.parentNode===U}}if(X){F.filter(U,Z,true)}}},"":function(W,U,Y){var V=L++,T=S;if(!U.match(/\W/)){var X=U=Y?U:U.toUpperCase();T=P}T("parentNode",U,V,W,X,Y)},"~":function(W,U,Y){var V=L++,T=S;if(typeof U==="string"&&!U.match(/\W/)){var X=U=Y?U:U.toUpperCase();T=P}T("previousSibling",U,V,W,X,Y)}},find:{ID:function(U,V,W){if(typeof V.getElementById!=="undefined"&&!W){var T=V.getElementById(U[1]);return T?[T]:[]}},NAME:function(V,Y,Z){if(typeof Y.getElementsByName!=="undefined"){var U=[],X=Y.getElementsByName(V[1]);for(var W=0,T=X.length;W<T;W++){if(X[W].getAttribute("name")===V[1]){U.push(X[W])}}return U.length===0?null:U}},TAG:function(T,U){return U.getElementsByTagName(T[1])}},preFilter:{CLASS:function(W,U,V,T,Z,aa){W=" "+W[1].replace(/\\/g,"")+" ";if(aa){return W}for(var X=0,Y;(Y=U[X])!=null;X++){if(Y){if(Z^(Y.className&&(" "+Y.className+" ").indexOf(W)>=0)){if(!V){T.push(Y)}}else{if(V){U[X]=false}}}}return false},ID:function(T){return T[1].replace(/\\/g,"")},TAG:function(U,T){for(var V=0;T[V]===false;V++){}return T[V]&&Q(T[V])?U[1]:U[1].toUpperCase()},CHILD:function(T){if(T[1]=="nth"){var U=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(T[2]=="even"&&"2n"||T[2]=="odd"&&"2n+1"||!/\D/.test(T[2])&&"0n+"+T[2]||T[2]);T[2]=(U[1]+(U[2]||1))-0;T[3]=U[3]-0}T[0]=L++;return T},ATTR:function(X,U,V,T,Y,Z){var W=X[1].replace(/\\/g,"");if(!Z&&I.attrMap[W]){X[1]=I.attrMap[W]}if(X[2]==="~="){X[4]=" "+X[4]+" "}return X},PSEUDO:function(X,U,V,T,Y){if(X[1]==="not"){if(X[3].match(R).length>1||/^\w/.test(X[3])){X[3]=F(X[3],null,null,U)}else{var W=F.filter(X[3],U,V,true^Y);if(!V){T.push.apply(T,W)}return false}}else{if(I.match.POS.test(X[0])||I.match.CHILD.test(X[0])){return true}}return X},POS:function(T){T.unshift(true);return T}},filters:{enabled:function(T){return T.disabled===false&&T.type!=="hidden"},disabled:function(T){return T.disabled===true},checked:function(T){return T.checked===true},selected:function(T){T.parentNode.selectedIndex;return T.selected===true},parent:function(T){return !!T.firstChild},empty:function(T){return !T.firstChild},has:function(V,U,T){return !!F(T[3],V).length},header:function(T){return/h\d/i.test(T.nodeName)},text:function(T){return"text"===T.type},radio:function(T){return"radio"===T.type},checkbox:function(T){return"checkbox"===T.type},file:function(T){return"file"===T.type},password:function(T){return"password"===T.type},submit:function(T){return"submit"===T.type},image:function(T){return"image"===T.type},reset:function(T){return"reset"===T.type},button:function(T){return"button"===T.type||T.nodeName.toUpperCase()==="BUTTON"},input:function(T){return/input|select|textarea|button/i.test(T.nodeName)}},setFilters:{first:function(U,T){return T===0},last:function(V,U,T,W){return U===W.length-1},even:function(U,T){return T%2===0},odd:function(U,T){return T%2===1},lt:function(V,U,T){return U<T[3]-0},gt:function(V,U,T){return U>T[3]-0},nth:function(V,U,T){return T[3]-0==U},eq:function(V,U,T){return T[3]-0==U}},filter:{PSEUDO:function(Z,V,W,aa){var U=V[1],X=I.filters[U];if(X){return X(Z,W,V,aa)}else{if(U==="contains"){return(Z.textContent||Z.innerText||"").indexOf(V[3])>=0}else{if(U==="not"){var Y=V[3];for(var W=0,T=Y.length;W<T;W++){if(Y[W]===Z){return false}}return true}}}},CHILD:function(T,W){var Z=W[1],U=T;switch(Z){case"only":case"first":while(U=U.previousSibling){if(U.nodeType===1){return false}}if(Z=="first"){return true}U=T;case"last":while(U=U.nextSibling){if(U.nodeType===1){return false}}return true;case"nth":var V=W[2],ac=W[3];if(V==1&&ac==0){return true}var Y=W[0],ab=T.parentNode;if(ab&&(ab.sizcache!==Y||!T.nodeIndex)){var X=0;for(U=ab.firstChild;U;U=U.nextSibling){if(U.nodeType===1){U.nodeIndex=++X}}ab.sizcache=Y}var aa=T.nodeIndex-ac;if(V==0){return aa==0}else{return(aa%V==0&&aa/V>=0)}}},ID:function(U,T){return U.nodeType===1&&U.getAttribute("id")===T},TAG:function(U,T){return(T==="*"&&U.nodeType===1)||U.nodeName===T},CLASS:function(U,T){return(" "+(U.className||U.getAttribute("class"))+" ").indexOf(T)>-1},ATTR:function(Y,W){var V=W[1],T=I.attrHandle[V]?I.attrHandle[V](Y):Y[V]!=null?Y[V]:Y.getAttribute(V),Z=T+"",X=W[2],U=W[4];return T==null?X==="!=":X==="="?Z===U:X==="*="?Z.indexOf(U)>=0:X==="~="?(" "+Z+" ").indexOf(U)>=0:!U?Z&&T!==false:X==="!="?Z!=U:X==="^="?Z.indexOf(U)===0:X==="$="?Z.substr(Z.length-U.length)===U:X==="|="?Z===U||Z.substr(0,U.length+1)===U+"-":false},POS:function(X,U,V,Y){var T=U[2],W=I.setFilters[T];if(W){return W(X,V,U,Y)}}}};var M=I.match.POS;for(var O in I.match){I.match[O]=RegExp(I.match[O].source+/(?![^\[]*\])(?![^\(]*\))/.source)}var E=function(U,T){U=Array.prototype.slice.call(U);if(T){T.push.apply(T,U);return T}return U};try{Array.prototype.slice.call(document.documentElement.childNodes)}catch(N){E=function(X,W){var U=W||[];if(H.call(X)==="[object Array]"){Array.prototype.push.apply(U,X)}else{if(typeof X.length==="number"){for(var V=0,T=X.length;V<T;V++){U.push(X[V])}}else{for(var V=0;X[V];V++){U.push(X[V])}}}return U}}var G;if(document.documentElement.compareDocumentPosition){G=function(U,T){var V=U.compareDocumentPosition(T)&4?-1:U===T?0:1;if(V===0){hasDuplicate=true}return V}}else{if("sourceIndex" in document.documentElement){G=function(U,T){var V=U.sourceIndex-T.sourceIndex;if(V===0){hasDuplicate=true}return V}}else{if(document.createRange){G=function(W,U){var V=W.ownerDocument.createRange(),T=U.ownerDocument.createRange();V.selectNode(W);V.collapse(true);T.selectNode(U);T.collapse(true);var X=V.compareBoundaryPoints(Range.START_TO_END,T);if(X===0){hasDuplicate=true}return X}}}}(function(){var U=document.createElement("form"),V="script"+(new Date).getTime();U.innerHTML="<input name='"+V+"'/>";var T=document.documentElement;T.insertBefore(U,T.firstChild);if(!!document.getElementById(V)){I.find.ID=function(X,Y,Z){if(typeof Y.getElementById!=="undefined"&&!Z){var W=Y.getElementById(X[1]);return W?W.id===X[1]||typeof W.getAttributeNode!=="undefined"&&W.getAttributeNode("id").nodeValue===X[1]?[W]:g:[]}};I.filter.ID=function(Y,W){var X=typeof Y.getAttributeNode!=="undefined"&&Y.getAttributeNode("id");return Y.nodeType===1&&X&&X.nodeValue===W}}T.removeChild(U)})();(function(){var T=document.createElement("div");T.appendChild(document.createComment(""));if(T.getElementsByTagName("*").length>0){I.find.TAG=function(U,Y){var X=Y.getElementsByTagName(U[1]);if(U[1]==="*"){var W=[];for(var V=0;X[V];V++){if(X[V].nodeType===1){W.push(X[V])}}X=W}return X}}T.innerHTML="<a href='#'></a>";if(T.firstChild&&typeof T.firstChild.getAttribute!=="undefined"&&T.firstChild.getAttribute("href")!=="#"){I.attrHandle.href=function(U){return U.getAttribute("href",2)}}})();if(document.querySelectorAll){(function(){var T=F,U=document.createElement("div");U.innerHTML="<p class='TEST'></p>";if(U.querySelectorAll&&U.querySelectorAll(".TEST").length===0){return}F=function(Y,X,V,W){X=X||document;if(!W&&X.nodeType===9&&!Q(X)){try{return E(X.querySelectorAll(Y),V)}catch(Z){}}return T(Y,X,V,W)};F.find=T.find;F.filter=T.filter;F.selectors=T.selectors;F.matches=T.matches})()}if(document.getElementsByClassName&&document.documentElement.getElementsByClassName){(function(){var T=document.createElement("div");T.innerHTML="<div class='test e'></div><div class='test'></div>";if(T.getElementsByClassName("e").length===0){return}T.lastChild.className="e";if(T.getElementsByClassName("e").length===1){return}I.order.splice(1,0,"CLASS");I.find.CLASS=function(U,V,W){if(typeof V.getElementsByClassName!=="undefined"&&!W){return V.getElementsByClassName(U[1])}}})()}function P(U,Z,Y,ad,aa,ac){var ab=U=="previousSibling"&&!ac;for(var W=0,V=ad.length;W<V;W++){var T=ad[W];if(T){if(ab&&T.nodeType===1){T.sizcache=Y;T.sizset=W}T=T[U];var X=false;while(T){if(T.sizcache===Y){X=ad[T.sizset];break}if(T.nodeType===1&&!ac){T.sizcache=Y;T.sizset=W}if(T.nodeName===Z){X=T;break}T=T[U]}ad[W]=X}}}function S(U,Z,Y,ad,aa,ac){var ab=U=="previousSibling"&&!ac;for(var W=0,V=ad.length;W<V;W++){var T=ad[W];if(T){if(ab&&T.nodeType===1){T.sizcache=Y;T.sizset=W}T=T[U];var X=false;while(T){if(T.sizcache===Y){X=ad[T.sizset];break}if(T.nodeType===1){if(!ac){T.sizcache=Y;T.sizset=W}if(typeof Z!=="string"){if(T===Z){X=true;break}}else{if(F.filter(Z,[T]).length>0){X=T;break}}}T=T[U]}ad[W]=X}}}var K=document.compareDocumentPosition?function(U,T){return U.compareDocumentPosition(T)&16}:function(U,T){return U!==T&&(U.contains?U.contains(T):true)};var Q=function(T){return T.nodeType===9&&T.documentElement.nodeName!=="HTML"||!!T.ownerDocument&&Q(T.ownerDocument)};var J=function(T,aa){var W=[],X="",Y,V=aa.nodeType?[aa]:aa;while((Y=I.match.PSEUDO.exec(T))){X+=Y[0];T=T.replace(I.match.PSEUDO,"")}T=I.relative[T]?T+"*":T;for(var Z=0,U=V.length;Z<U;Z++){F(T,V[Z],W)}return F.filter(X,W)};o.find=F;o.filter=F.filter;o.expr=F.selectors;o.expr[":"]=o.expr.filters;F.selectors.filters.hidden=function(T){return T.offsetWidth===0||T.offsetHeight===0};F.selectors.filters.visible=function(T){return T.offsetWidth>0||T.offsetHeight>0};F.selectors.filters.animated=function(T){return o.grep(o.timers,function(U){return T===U.elem}).length};o.multiFilter=function(V,T,U){if(U){V=":not("+V+")"}return F.matches(V,T)};o.dir=function(V,U){var T=[],W=V[U];while(W&&W!=document){if(W.nodeType==1){T.push(W)}W=W[U]}return T};o.nth=function(X,T,V,W){T=T||1;var U=0;for(;X;X=X[V]){if(X.nodeType==1&&++U==T){break}}return X};o.sibling=function(V,U){var T=[];for(;V;V=V.nextSibling){if(V.nodeType==1&&V!=U){T.push(V)}}return T};return;l.Sizzle=F})();o.event={add:function(I,F,H,K){if(I.nodeType==3||I.nodeType==8){return}if(I.setInterval&&I!=l){I=l}if(!H.guid){H.guid=this.guid++}if(K!==g){var G=H;H=this.proxy(G);H.data=K}var E=o.data(I,"events")||o.data(I,"events",{}),J=o.data(I,"handle")||o.data(I,"handle",function(){return typeof o!=="undefined"&&!o.event.triggered?o.event.handle.apply(arguments.callee.elem,arguments):g});J.elem=I;o.each(F.split(/\s+/),function(M,N){var O=N.split(".");N=O.shift();H.type=O.slice().sort().join(".");var L=E[N];if(o.event.specialAll[N]){o.event.specialAll[N].setup.call(I,K,O)}if(!L){L=E[N]={};if(!o.event.special[N]||o.event.special[N].setup.call(I,K,O)===false){if(I.addEventListener){I.addEventListener(N,J,false)}else{if(I.attachEvent){I.attachEvent("on"+N,J)}}}}L[H.guid]=H;o.event.global[N]=true});I=null},guid:1,global:{},remove:function(K,H,J){if(K.nodeType==3||K.nodeType==8){return}var G=o.data(K,"events"),F,E;if(G){if(H===g||(typeof H==="string"&&H.charAt(0)==".")){for(var I in G){this.remove(K,I+(H||""))}}else{if(H.type){J=H.handler;H=H.type}o.each(H.split(/\s+/),function(M,O){var Q=O.split(".");O=Q.shift();var N=RegExp("(^|\\.)"+Q.slice().sort().join(".*\\.")+"(\\.|$)");if(G[O]){if(J){delete G[O][J.guid]}else{for(var P in G[O]){if(N.test(G[O][P].type)){delete G[O][P]}}}if(o.event.specialAll[O]){o.event.specialAll[O].teardown.call(K,Q)}for(F in G[O]){break}if(!F){if(!o.event.special[O]||o.event.special[O].teardown.call(K,Q)===false){if(K.removeEventListener){K.removeEventListener(O,o.data(K,"handle"),false)}else{if(K.detachEvent){K.detachEvent("on"+O,o.data(K,"handle"))}}}F=null;delete G[O]}}})}for(F in G){break}if(!F){var L=o.data(K,"handle");if(L){L.elem=null}o.removeData(K,"events");o.removeData(K,"handle")}}},trigger:function(I,K,H,E){var G=I.type||I;if(!E){I=typeof I==="object"?I[h]?I:o.extend(o.Event(G),I):o.Event(G);if(G.indexOf("!")>=0){I.type=G=G.slice(0,-1);I.exclusive=true}if(!H){I.stopPropagation();if(this.global[G]){o.each(o.cache,function(){if(this.events&&this.events[G]){o.event.trigger(I,K,this.handle.elem)}})}}if(!H||H.nodeType==3||H.nodeType==8){return g}I.result=g;I.target=H;K=o.makeArray(K);K.unshift(I)}I.currentTarget=H;var J=o.data(H,"handle");if(J){J.apply(H,K)}if((!H[G]||(o.nodeName(H,"a")&&G=="click"))&&H["on"+G]&&H["on"+G].apply(H,K)===false){I.result=false}if(!E&&H[G]&&!I.isDefaultPrevented()&&!(o.nodeName(H,"a")&&G=="click")){this.triggered=true;try{H[G]()}catch(L){}}this.triggered=false;if(!I.isPropagationStopped()){var F=H.parentNode||H.ownerDocument;if(F){o.event.trigger(I,K,F,true)}}},handle:function(K){var J,E;K=arguments[0]=o.event.fix(K||l.event);K.currentTarget=this;var L=K.type.split(".");K.type=L.shift();J=!L.length&&!K.exclusive;var I=RegExp("(^|\\.)"+L.slice().sort().join(".*\\.")+"(\\.|$)");E=(o.data(this,"events")||{})[K.type];for(var G in E){var H=E[G];if(J||I.test(H.type)){K.handler=H;K.data=H.data;var F=H.apply(this,arguments);if(F!==g){K.result=F;if(F===false){K.preventDefault();K.stopPropagation()}}if(K.isImmediatePropagationStopped()){break}}}},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(H){if(H[h]){return H}var F=H;H=o.Event(F);for(var G=this.props.length,J;G;){J=this.props[--G];H[J]=F[J]}if(!H.target){H.target=H.srcElement||document}if(H.target.nodeType==3){H.target=H.target.parentNode}if(!H.relatedTarget&&H.fromElement){H.relatedTarget=H.fromElement==H.target?H.toElement:H.fromElement}if(H.pageX==null&&H.clientX!=null){var I=document.documentElement,E=document.body;H.pageX=H.clientX+(I&&I.scrollLeft||E&&E.scrollLeft||0)-(I.clientLeft||0);H.pageY=H.clientY+(I&&I.scrollTop||E&&E.scrollTop||0)-(I.clientTop||0)}if(!H.which&&((H.charCode||H.charCode===0)?H.charCode:H.keyCode)){H.which=H.charCode||H.keyCode}if(!H.metaKey&&H.ctrlKey){H.metaKey=H.ctrlKey}if(!H.which&&H.button){H.which=(H.button&1?1:(H.button&2?3:(H.button&4?2:0)))}return H},proxy:function(F,E){E=E||function(){return F.apply(this,arguments)};E.guid=F.guid=F.guid||E.guid||this.guid++;return E},special:{ready:{setup:B,teardown:function(){}}},specialAll:{live:{setup:function(E,F){o.event.add(this,F[0],c)},teardown:function(G){if(G.length){var E=0,F=RegExp("(^|\\.)"+G[0]+"(\\.|$)");o.each((o.data(this,"events").live||{}),function(){if(F.test(this.type)){E++}});if(E<1){o.event.remove(this,G[0],c)}}}}}};o.Event=function(E){if(!this.preventDefault){return new o.Event(E)}if(E&&E.type){this.originalEvent=E;this.type=E.type}else{this.type=E}this.timeStamp=e();this[h]=true};function k(){return false}function u(){return true}o.Event.prototype={preventDefault:function(){this.isDefaultPrevented=u;var E=this.originalEvent;if(!E){return}if(E.preventDefault){E.preventDefault()}E.returnValue=false},stopPropagation:function(){this.isPropagationStopped=u;var E=this.originalEvent;if(!E){return}if(E.stopPropagation){E.stopPropagation()}E.cancelBubble=true},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=u;this.stopPropagation()},isDefaultPrevented:k,isPropagationStopped:k,isImmediatePropagationStopped:k};var a=function(F){var E=F.relatedTarget;while(E&&E!=this){try{E=E.parentNode}catch(G){E=this}}if(E!=this){F.type=F.data;o.event.handle.apply(this,arguments)}};o.each({mouseover:"mouseenter",mouseout:"mouseleave"},function(F,E){o.event.special[E]={setup:function(){o.event.add(this,F,a,E)},teardown:function(){o.event.remove(this,F,a)}}});o.fn.extend({bind:function(F,G,E){return F=="unload"?this.one(F,G,E):this.each(function(){o.event.add(this,F,E||G,E&&G)})},one:function(G,H,F){var E=o.event.proxy(F||H,function(I){o(this).unbind(I,E);return(F||H).apply(this,arguments)});return this.each(function(){o.event.add(this,G,E,F&&H)})},unbind:function(F,E){return this.each(function(){o.event.remove(this,F,E)})},trigger:function(E,F){return this.each(function(){o.event.trigger(E,F,this)})},triggerHandler:function(E,G){if(this[0]){var F=o.Event(E);F.preventDefault();F.stopPropagation();o.event.trigger(F,G,this[0]);return F.result}},toggle:function(G){var E=arguments,F=1;while(F<E.length){o.event.proxy(G,E[F++])}return this.click(o.event.proxy(G,function(H){this.lastToggle=(this.lastToggle||0)%F;H.preventDefault();return E[this.lastToggle++].apply(this,arguments)||false}))},hover:function(E,F){return this.mouseenter(E).mouseleave(F)},ready:function(E){B();if(o.isReady){E.call(document,o)}else{o.readyList.push(E)}return this},live:function(G,F){var E=o.event.proxy(F);E.guid+=this.selector+G;o(document).bind(i(G,this.selector),this.selector,E);return this},die:function(F,E){o(document).unbind(i(F,this.selector),E?{guid:E.guid+this.selector+F}:null);return this}});function c(H){var E=RegExp("(^|\\.)"+H.type+"(\\.|$)"),G=true,F=[];o.each(o.data(this,"events").live||[],function(I,J){if(E.test(J.type)){var K=o(H.target).closest(J.data)[0];if(K){F.push({elem:K,fn:J})}}});F.sort(function(J,I){return o.data(J.elem,"closest")-o.data(I.elem,"closest")});o.each(F,function(){if(this.fn.call(this.elem,H,this.fn.data)===false){return(G=false)}});return G}function i(F,E){return["live",F,E.replace(/\./g,"`").replace(/ /g,"|")].join(".")}o.extend({isReady:false,readyList:[],ready:function(){if(!o.isReady){o.isReady=true;if(o.readyList){o.each(o.readyList,function(){this.call(document,o)});o.readyList=null}o(document).triggerHandler("ready")}}});var x=false;function B(){if(x){return}x=true;if(document.addEventListener){document.addEventListener("DOMContentLoaded",function(){document.removeEventListener("DOMContentLoaded",arguments.callee,false);o.ready()},false)}else{if(document.attachEvent){document.attachEvent("onreadystatechange",function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",arguments.callee);o.ready()}});if(document.documentElement.doScroll&&l==l.top){(function(){if(o.isReady){return}try{document.documentElement.doScroll("left")}catch(E){setTimeout(arguments.callee,0);return}o.ready()})()}}}o.event.add(l,"load",o.ready)}o.each(("blur,focus,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,change,select,submit,keydown,keypress,keyup,error").split(","),function(F,E){o.fn[E]=function(G){return G?this.bind(E,G):this.trigger(E)}});o(l).bind("unload",function(){for(var E in o.cache){if(E!=1&&o.cache[E].handle){o.event.remove(o.cache[E].handle.elem)}}});(function(){o.support={};var F=document.documentElement,G=document.createElement("script"),K=document.createElement("div"),J="script"+(new Date).getTime();K.style.display="none";K.innerHTML='   <link/><table></table><a href="/a" style="color:red;float:left;opacity:.5;">a</a><select><option>text</option></select><object><param/></object>';var H=K.getElementsByTagName("*"),E=K.getElementsByTagName("a")[0];if(!H||!H.length||!E){return}o.support={leadingWhitespace:K.firstChild.nodeType==3,tbody:!K.getElementsByTagName("tbody").length,objectAll:!!K.getElementsByTagName("object")[0].getElementsByTagName("*").length,htmlSerialize:!!K.getElementsByTagName("link").length,style:/red/.test(E.getAttribute("style")),hrefNormalized:E.getAttribute("href")==="/a",opacity:E.style.opacity==="0.5",cssFloat:!!E.style.cssFloat,scriptEval:false,noCloneEvent:true,boxModel:null};G.type="text/javascript";try{G.appendChild(document.createTextNode("window."+J+"=1;"))}catch(I){}F.insertBefore(G,F.firstChild);if(l[J]){o.support.scriptEval=true;delete l[J]}F.removeChild(G);if(K.attachEvent&&K.fireEvent){K.attachEvent("onclick",function(){o.support.noCloneEvent=false;K.detachEvent("onclick",arguments.callee)});K.cloneNode(true).fireEvent("onclick")}o(function(){var L=document.createElement("div");L.style.width=L.style.paddingLeft="1px";document.body.appendChild(L);o.boxModel=o.support.boxModel=L.offsetWidth===2;document.body.removeChild(L).style.display="none"})})();var w=o.support.cssFloat?"cssFloat":"styleFloat";o.props={"for":"htmlFor","class":"className","float":w,cssFloat:w,styleFloat:w,readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",tabindex:"tabIndex"};o.fn.extend({_load:o.fn.load,load:function(G,J,K){if(typeof G!=="string"){return this._load(G)}var I=G.indexOf(" ");if(I>=0){var E=G.slice(I,G.length);G=G.slice(0,I)}var H="GET";if(J){if(o.isFunction(J)){K=J;J=null}else{if(typeof J==="object"){J=o.param(J);H="POST"}}}var F=this;o.ajax({url:G,type:H,dataType:"html",data:J,complete:function(M,L){if(L=="success"||L=="notmodified"){F.html(E?o("<div/>").append(M.responseText.replace(/<script(.|\s)*?\/script>/g,"")).find(E):M.responseText)}if(K){F.each(K,[M.responseText,L,M])}}});return this},serialize:function(){return o.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?o.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||/select|textarea/i.test(this.nodeName)||/text|hidden|password|search/i.test(this.type))}).map(function(E,F){var G=o(this).val();return G==null?null:o.isArray(G)?o.map(G,function(I,H){return{name:F.name,value:I}}):{name:F.name,value:G}}).get()}});o.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","),function(E,F){o.fn[F]=function(G){return this.bind(F,G)}});var r=e();o.extend({get:function(E,G,H,F){if(o.isFunction(G)){H=G;G=null}return o.ajax({type:"GET",url:E,data:G,success:H,dataType:F})},getScript:function(E,F){return o.get(E,null,F,"script")},getJSON:function(E,F,G){return o.get(E,F,G,"json")},post:function(E,G,H,F){if(o.isFunction(G)){H=G;G={}}return o.ajax({type:"POST",url:E,data:G,success:H,dataType:F})},ajaxSetup:function(E){o.extend(o.ajaxSettings,E)},ajaxSettings:{url:location.href,global:true,type:"GET",contentType:"application/x-www-form-urlencoded",processData:true,async:true,xhr:function(){return l.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest()},accepts:{xml:"application/xml, text/xml",html:"text/html",script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"}},lastModified:{},ajax:function(M){M=o.extend(true,M,o.extend(true,{},o.ajaxSettings,M));var W,F=/=\?(&|$)/g,R,V,G=M.type.toUpperCase();if(M.data&&M.processData&&typeof M.data!=="string"){M.data=o.param(M.data)}if(M.dataType=="jsonp"){if(G=="GET"){if(!M.url.match(F)){M.url+=(M.url.match(/\?/)?"&":"?")+(M.jsonp||"callback")+"=?"}}else{if(!M.data||!M.data.match(F)){M.data=(M.data?M.data+"&":"")+(M.jsonp||"callback")+"=?"}}M.dataType="json"}if(M.dataType=="json"&&(M.data&&M.data.match(F)||M.url.match(F))){W="jsonp"+r++;if(M.data){M.data=(M.data+"").replace(F,"="+W+"$1")}M.url=M.url.replace(F,"="+W+"$1");M.dataType="script";l[W]=function(X){V=X;I();L();l[W]=g;try{delete l[W]}catch(Y){}if(H){H.removeChild(T)}}}if(M.dataType=="script"&&M.cache==null){M.cache=false}if(M.cache===false&&G=="GET"){var E=e();var U=M.url.replace(/(\?|&)_=.*?(&|$)/,"$1_="+E+"$2");M.url=U+((U==M.url)?(M.url.match(/\?/)?"&":"?")+"_="+E:"")}if(M.data&&G=="GET"){M.url+=(M.url.match(/\?/)?"&":"?")+M.data;M.data=null}if(M.global&&!o.active++){o.event.trigger("ajaxStart")}var Q=/^(\w+:)?\/\/([^\/?#]+)/.exec(M.url);if(M.dataType=="script"&&G=="GET"&&Q&&(Q[1]&&Q[1]!=location.protocol||Q[2]!=location.host)){var H=document.getElementsByTagName("head")[0];var T=document.createElement("script");T.src=M.url;if(M.scriptCharset){T.charset=M.scriptCharset}if(!W){var O=false;T.onload=T.onreadystatechange=function(){if(!O&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){O=true;I();L();T.onload=T.onreadystatechange=null;H.removeChild(T)}}}H.appendChild(T);return g}var K=false;var J=M.xhr();if(M.username){J.open(G,M.url,M.async,M.username,M.password)}else{J.open(G,M.url,M.async)}try{if(M.data){J.setRequestHeader("Content-Type",M.contentType)}if(M.ifModified){J.setRequestHeader("If-Modified-Since",o.lastModified[M.url]||"Thu, 01 Jan 1970 00:00:00 GMT")}J.setRequestHeader("X-Requested-With","XMLHttpRequest");J.setRequestHeader("Accept",M.dataType&&M.accepts[M.dataType]?M.accepts[M.dataType]+", */*":M.accepts._default)}catch(S){}if(M.beforeSend&&M.beforeSend(J,M)===false){if(M.global&&!--o.active){o.event.trigger("ajaxStop")}J.abort();return false}if(M.global){o.event.trigger("ajaxSend",[J,M])}var N=function(X){if(J.readyState==0){if(P){clearInterval(P);P=null;if(M.global&&!--o.active){o.event.trigger("ajaxStop")}}}else{if(!K&&J&&(J.readyState==4||X=="timeout")){K=true;if(P){clearInterval(P);P=null}R=X=="timeout"?"timeout":!o.httpSuccess(J)?"error":M.ifModified&&o.httpNotModified(J,M.url)?"notmodified":"success";if(R=="success"){try{V=o.httpData(J,M.dataType,M)}catch(Z){R="parsererror"}}if(R=="success"){var Y;try{Y=J.getResponseHeader("Last-Modified")}catch(Z){}if(M.ifModified&&Y){o.lastModified[M.url]=Y}if(!W){I()}}else{o.handleError(M,J,R)}L();if(X){J.abort()}if(M.async){J=null}}}};if(M.async){var P=setInterval(N,13);if(M.timeout>0){setTimeout(function(){if(J&&!K){N("timeout")}},M.timeout)}}try{J.send(M.data)}catch(S){o.handleError(M,J,null,S)}if(!M.async){N()}function I(){if(M.success){M.success(V,R)}if(M.global){o.event.trigger("ajaxSuccess",[J,M])}}function L(){if(M.complete){M.complete(J,R)}if(M.global){o.event.trigger("ajaxComplete",[J,M])}if(M.global&&!--o.active){o.event.trigger("ajaxStop")}}return J},handleError:function(F,H,E,G){if(F.error){F.error(H,E,G)}if(F.global){o.event.trigger("ajaxError",[H,F,G])}},active:0,httpSuccess:function(F){try{return !F.status&&location.protocol=="file:"||(F.status>=200&&F.status<300)||F.status==304||F.status==1223}catch(E){}return false},httpNotModified:function(G,E){try{var H=G.getResponseHeader("Last-Modified");return G.status==304||H==o.lastModified[E]}catch(F){}return false},httpData:function(J,H,G){var F=J.getResponseHeader("content-type"),E=H=="xml"||!H&&F&&F.indexOf("xml")>=0,I=E?J.responseXML:J.responseText;if(E&&I.documentElement.tagName=="parsererror"){throw"parsererror"}if(G&&G.dataFilter){I=G.dataFilter(I,H)}if(typeof I==="string"){if(H=="script"){o.globalEval(I)}if(H=="json"){I=l["eval"]("("+I+")")}}return I},param:function(E){var G=[];function H(I,J){G[G.length]=encodeURIComponent(I)+"="+encodeURIComponent(J)}if(o.isArray(E)||E.jquery){o.each(E,function(){H(this.name,this.value)})}else{for(var F in E){if(o.isArray(E[F])){o.each(E[F],function(){H(F,this)})}else{H(F,o.isFunction(E[F])?E[F]():E[F])}}}return G.join("&").replace(/%20/g,"+")}});var m={},n,d=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];function t(F,E){var G={};o.each(d.concat.apply([],d.slice(0,E)),function(){G[this]=F});return G}o.fn.extend({show:function(J,L){if(J){return this.animate(t("show",3),J,L)}else{for(var H=0,F=this.length;H<F;H++){var E=o.data(this[H],"olddisplay");this[H].style.display=E||"";if(o.css(this[H],"display")==="none"){var G=this[H].tagName,K;if(m[G]){K=m[G]}else{var I=o("<"+G+" />").appendTo("body");K=I.css("display");if(K==="none"){K="block"}I.remove();m[G]=K}o.data(this[H],"olddisplay",K)}}for(var H=0,F=this.length;H<F;H++){this[H].style.display=o.data(this[H],"olddisplay")||""}return this}},hide:function(H,I){if(H){return this.animate(t("hide",3),H,I)}else{for(var G=0,F=this.length;G<F;G++){var E=o.data(this[G],"olddisplay");if(!E&&E!=="none"){o.data(this[G],"olddisplay",o.css(this[G],"display"))}}for(var G=0,F=this.length;G<F;G++){this[G].style.display="none"}return this}},_toggle:o.fn.toggle,toggle:function(G,F){var E=typeof G==="boolean";return o.isFunction(G)&&o.isFunction(F)?this._toggle.apply(this,arguments):G==null||E?this.each(function(){var H=E?G:o(this).is(":hidden");o(this)[H?"show":"hide"]()}):this.animate(t("toggle",3),G,F)},fadeTo:function(E,G,F){return this.animate({opacity:G},E,F)},animate:function(I,F,H,G){var E=o.speed(F,H,G);return this[E.queue===false?"each":"queue"](function(){var K=o.extend({},E),M,L=this.nodeType==1&&o(this).is(":hidden"),J=this;for(M in I){if(I[M]=="hide"&&L||I[M]=="show"&&!L){return K.complete.call(this)}if((M=="height"||M=="width")&&this.style){K.display=o.css(this,"display");K.overflow=this.style.overflow}}if(K.overflow!=null){this.style.overflow="hidden"}K.curAnim=o.extend({},I);o.each(I,function(O,S){var R=new o.fx(J,K,O);if(/toggle|show|hide/.test(S)){R[S=="toggle"?L?"show":"hide":S](I)}else{var Q=S.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),T=R.cur(true)||0;if(Q){var N=parseFloat(Q[2]),P=Q[3]||"px";if(P!="px"){J.style[O]=(N||1)+P;T=((N||1)/R.cur(true))*T;J.style[O]=T+P}if(Q[1]){N=((Q[1]=="-="?-1:1)*N)+T}R.custom(T,N,P)}else{R.custom(T,S,"")}}});return true})},stop:function(F,E){var G=o.timers;if(F){this.queue([])}this.each(function(){for(var H=G.length-1;H>=0;H--){if(G[H].elem==this){if(E){G[H](true)}G.splice(H,1)}}});if(!E){this.dequeue()}return this}});o.each({slideDown:t("show",1),slideUp:t("hide",1),slideToggle:t("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"}},function(E,F){o.fn[E]=function(G,H){return this.animate(F,G,H)}});o.extend({speed:function(G,H,F){var E=typeof G==="object"?G:{complete:F||!F&&H||o.isFunction(G)&&G,duration:G,easing:F&&H||H&&!o.isFunction(H)&&H};E.duration=o.fx.off?0:typeof E.duration==="number"?E.duration:o.fx.speeds[E.duration]||o.fx.speeds._default;E.old=E.complete;E.complete=function(){if(E.queue!==false){o(this).dequeue()}if(o.isFunction(E.old)){E.old.call(this)}};return E},easing:{linear:function(G,H,E,F){return E+F*G},swing:function(G,H,E,F){return((-Math.cos(G*Math.PI)/2)+0.5)*F+E}},timers:[],fx:function(F,E,G){this.options=E;this.elem=F;this.prop=G;if(!E.orig){E.orig={}}}});o.fx.prototype={update:function(){if(this.options.step){this.options.step.call(this.elem,this.now,this)}(o.fx.step[this.prop]||o.fx.step._default)(this);if((this.prop=="height"||this.prop=="width")&&this.elem.style){this.elem.style.display="block"}},cur:function(F){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null)){return this.elem[this.prop]}var E=parseFloat(o.css(this.elem,this.prop,F));return E&&E>-10000?E:parseFloat(o.curCSS(this.elem,this.prop))||0},custom:function(I,H,G){this.startTime=e();this.start=I;this.end=H;this.unit=G||this.unit||"px";this.now=this.start;this.pos=this.state=0;var E=this;function F(J){return E.step(J)}F.elem=this.elem;if(F()&&o.timers.push(F)&&!n){n=setInterval(function(){var K=o.timers;for(var J=0;J<K.length;J++){if(!K[J]()){K.splice(J--,1)}}if(!K.length){clearInterval(n);n=g}},13)}},show:function(){this.options.orig[this.prop]=o.attr(this.elem.style,this.prop);this.options.show=true;this.custom(this.prop=="width"||this.prop=="height"?1:0,this.cur());o(this.elem).show()},hide:function(){this.options.orig[this.prop]=o.attr(this.elem.style,this.prop);this.options.hide=true;this.custom(this.cur(),0)},step:function(H){var G=e();if(H||G>=this.options.duration+this.startTime){this.now=this.end;this.pos=this.state=1;this.update();this.options.curAnim[this.prop]=true;var E=true;for(var F in this.options.curAnim){if(this.options.curAnim[F]!==true){E=false}}if(E){if(this.options.display!=null){this.elem.style.overflow=this.options.overflow;this.elem.style.display=this.options.display;if(o.css(this.elem,"display")=="none"){this.elem.style.display="block"}}if(this.options.hide){o(this.elem).hide()}if(this.options.hide||this.options.show){for(var I in this.options.curAnim){o.attr(this.elem.style,I,this.options.orig[I])}}this.options.complete.call(this.elem)}return false}else{var J=G-this.startTime;this.state=J/this.options.duration;this.pos=o.easing[this.options.easing||(o.easing.swing?"swing":"linear")](this.state,J,0,1,this.options.duration);this.now=this.start+((this.end-this.start)*this.pos);this.update()}return true}};o.extend(o.fx,{speeds:{slow:600,fast:200,_default:400},step:{opacity:function(E){o.attr(E.elem.style,"opacity",E.now)},_default:function(E){if(E.elem.style&&E.elem.style[E.prop]!=null){E.elem.style[E.prop]=E.now+E.unit}else{E.elem[E.prop]=E.now}}}});if(document.documentElement.getBoundingClientRect){o.fn.offset=function(){if(!this[0]){return{top:0,left:0}}if(this[0]===this[0].ownerDocument.body){return o.offset.bodyOffset(this[0])}var G=this[0].getBoundingClientRect(),J=this[0].ownerDocument,F=J.body,E=J.documentElement,L=E.clientTop||F.clientTop||0,K=E.clientLeft||F.clientLeft||0,I=G.top+(self.pageYOffset||o.boxModel&&E.scrollTop||F.scrollTop)-L,H=G.left+(self.pageXOffset||o.boxModel&&E.scrollLeft||F.scrollLeft)-K;return{top:I,left:H}}}else{o.fn.offset=function(){if(!this[0]){return{top:0,left:0}}if(this[0]===this[0].ownerDocument.body){return o.offset.bodyOffset(this[0])}o.offset.initialized||o.offset.initialize();var J=this[0],G=J.offsetParent,F=J,O=J.ownerDocument,M,H=O.documentElement,K=O.body,L=O.defaultView,E=L.getComputedStyle(J,null),N=J.offsetTop,I=J.offsetLeft;while((J=J.parentNode)&&J!==K&&J!==H){M=L.getComputedStyle(J,null);N-=J.scrollTop,I-=J.scrollLeft;if(J===G){N+=J.offsetTop,I+=J.offsetLeft;if(o.offset.doesNotAddBorder&&!(o.offset.doesAddBorderForTableAndCells&&/^t(able|d|h)$/i.test(J.tagName))){N+=parseInt(M.borderTopWidth,10)||0,I+=parseInt(M.borderLeftWidth,10)||0}F=G,G=J.offsetParent}if(o.offset.subtractsBorderForOverflowNotVisible&&M.overflow!=="visible"){N+=parseInt(M.borderTopWidth,10)||0,I+=parseInt(M.borderLeftWidth,10)||0}E=M}if(E.position==="relative"||E.position==="static"){N+=K.offsetTop,I+=K.offsetLeft}if(E.position==="fixed"){N+=Math.max(H.scrollTop,K.scrollTop),I+=Math.max(H.scrollLeft,K.scrollLeft)}return{top:N,left:I}}}o.offset={initialize:function(){if(this.initialized){return}var L=document.body,F=document.createElement("div"),H,G,N,I,M,E,J=L.style.marginTop,K='<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;" cellpadding="0" cellspacing="0"><tr><td></td></tr></table>';M={position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"};for(E in M){F.style[E]=M[E]}F.innerHTML=K;L.insertBefore(F,L.firstChild);H=F.firstChild,G=H.firstChild,I=H.nextSibling.firstChild.firstChild;this.doesNotAddBorder=(G.offsetTop!==5);this.doesAddBorderForTableAndCells=(I.offsetTop===5);H.style.overflow="hidden",H.style.position="relative";this.subtractsBorderForOverflowNotVisible=(G.offsetTop===-5);L.style.marginTop="1px";this.doesNotIncludeMarginInBodyOffset=(L.offsetTop===0);L.style.marginTop=J;L.removeChild(F);this.initialized=true},bodyOffset:function(E){o.offset.initialized||o.offset.initialize();var G=E.offsetTop,F=E.offsetLeft;if(o.offset.doesNotIncludeMarginInBodyOffset){G+=parseInt(o.curCSS(E,"marginTop",true),10)||0,F+=parseInt(o.curCSS(E,"marginLeft",true),10)||0}return{top:G,left:F}}};o.fn.extend({position:function(){var I=0,H=0,F;if(this[0]){var G=this.offsetParent(),J=this.offset(),E=/^body|html$/i.test(G[0].tagName)?{top:0,left:0}:G.offset();J.top-=j(this,"marginTop");J.left-=j(this,"marginLeft");E.top+=j(G,"borderTopWidth");E.left+=j(G,"borderLeftWidth");F={top:J.top-E.top,left:J.left-E.left}}return F},offsetParent:function(){var E=this[0].offsetParent||document.body;while(E&&(!/^body|html$/i.test(E.tagName)&&o.css(E,"position")=="static")){E=E.offsetParent}return o(E)}});o.each(["Left","Top"],function(F,E){var G="scroll"+E;o.fn[G]=function(H){if(!this[0]){return null}return H!==g?this.each(function(){this==l||this==document?l.scrollTo(!F?H:o(l).scrollLeft(),F?H:o(l).scrollTop()):this[G]=H}):this[0]==l||this[0]==document?self[F?"pageYOffset":"pageXOffset"]||o.boxModel&&document.documentElement[G]||document.body[G]:this[0][G]}});o.each(["Height","Width"],function(I,G){var E=I?"Left":"Top",H=I?"Right":"Bottom",F=G.toLowerCase();o.fn["inner"+G]=function(){return this[0]?o.css(this[0],F,false,"padding"):null};o.fn["outer"+G]=function(K){return this[0]?o.css(this[0],F,false,K?"margin":"border"):null};var J=G.toLowerCase();o.fn[J]=function(K){return this[0]==l?document.compatMode=="CSS1Compat"&&document.documentElement["client"+G]||document.body["client"+G]:this[0]==document?Math.max(document.documentElement["client"+G],document.body["scroll"+G],document.documentElement["scroll"+G],document.body["offset"+G],document.documentElement["offset"+G]):K===g?(this.length?o.css(this[0],J):null):this.css(J,typeof K==="string"?K:K+"px")}})})();







/**
* hoverIntent r5 // 2007.03.27 // jQuery 1.1.2+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne <brian@cherne.net>
*/
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY;};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev]);}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev]);};var handleHover=function(e){var p=(e.type=="mouseover"?e.fromElement:e.toElement)||e.relatedTarget;while(p&&p!=this){try{p=p.parentNode;}catch(e){p=this;}}if(p==this){return false;}var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);}if(e.type=="mouseover"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob);},cfg.timeout);}}};return this.mouseover(handleHover).mouseout(handleHover);};})(jQuery);
/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2007-07-21 18:45:56 -0500 (Sat, 21 Jul 2007) $
 * $Rev: 2447 $
 *
 * Version 2.1.1
 */
(function($){$.fn.bgIframe=$.fn.bgiframe=function(s){if($.browser.msie&&/6.0/.test(navigator.userAgent)){s=$.extend({top:'auto',left:'auto',width:'auto',height:'auto',opacity:true,src:'javascript:false;'},s||{});var prop=function(n){return n&&n.constructor==Number?n+'px':n;},html='<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+'style="display:block;position:absolute;z-index:-1;'+(s.opacity!==false?'filter:Alpha(Opacity=\'0\');':'')+'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+'"/>';return this.each(function(){if($('> iframe.bgiframe',this).length==0)this.insertBefore(document.createElement(html),this.firstChild);});}return this;};})(jQuery);
/*
 * @name BeautyTips
 * @desc a tooltips/baloon-help plugin for jQuery
 *
 * @author Jeff Robbins - Lullabot - http://www.lullabot.com
 * @version 0.9.5-rc1  (5/20/2009)
 */
jQuery.bt={version:"0.9.5-rc1"};(function($){jQuery.fn.bt=function(content,options){if(typeof content!="string"){var contentSelect=true;options=content;content=false;}else{var contentSelect=false;}if(jQuery.fn.hoverIntent&&jQuery.bt.defaults.trigger=="hover"){jQuery.bt.defaults.trigger="hoverIntent";}return this.each(function(index){var opts=jQuery.extend(false,jQuery.bt.defaults,jQuery.bt.options,options);opts.spikeLength=numb(opts.spikeLength);opts.spikeGirth=numb(opts.spikeGirth);opts.overlap=numb(opts.overlap);var ajaxTimeout=false;if(opts.killTitle){$(this).find("[title]").andSelf().each(function(){if(!$(this).attr("bt-xTitle")){$(this).attr("bt-xTitle",$(this).attr("title")).attr("title","");}});}if(typeof opts.trigger=="string"){opts.trigger=[opts.trigger];}if(opts.trigger[0]=="hoverIntent"){var hoverOpts=jQuery.extend(opts.hoverIntentOpts,{over:function(){this.btOn();},out:function(){this.btOff();}});$(this).hoverIntent(hoverOpts);}else{if(opts.trigger[0]=="hover"){$(this).hover(function(){this.btOn();},function(){this.btOff();});}else{if(opts.trigger[0]=="now"){if($(this).hasClass("bt-active")){this.btOff();}else{this.btOn();}}else{if(opts.trigger[0]=="none"){}else{if(opts.trigger.length>1&&opts.trigger[0]!=opts.trigger[1]){$(this).bind(opts.trigger[0],function(){this.btOn();}).bind(opts.trigger[1],function(){this.btOff();});}else{$(this).bind(opts.trigger[0],function(){if($(this).hasClass("bt-active")){this.btOff();}else{this.btOn();}});}}}}}this.btOn=function(){if(typeof $(this).data("bt-box")=="object"){this.btOff();}opts.preBuild.apply(this);$(jQuery.bt.vars.closeWhenOpenStack).btOff();$(this).addClass("bt-active "+opts.activeClass);if(contentSelect&&opts.ajaxPath==null){if(opts.killTitle){$(this).attr("title",$(this).attr("bt-xTitle"));}content=$.isFunction(opts.contentSelector)?opts.contentSelector.apply(this):eval(opts.contentSelector);if(opts.killTitle){$(this).attr("title","");}}if(opts.ajaxPath!=null&&content==false){if(typeof opts.ajaxPath=="object"){var url=eval(opts.ajaxPath[0]);url+=opts.ajaxPath[1]?" "+opts.ajaxPath[1]:"";}else{var url=opts.ajaxPath;}var off=url.indexOf(" ");if(off>=0){var selector=url.slice(off,url.length);url=url.slice(0,off);}var cacheData=opts.ajaxCache?$(document.body).data("btCache-"+url.replace(/\./g,"")):null;if(typeof cacheData=="string"){content=selector?$("<div/>").append(cacheData.replace(/<script(.|\s)*?\/script>/g,"")).find(selector):cacheData;}else{var target=this;var ajaxOpts=jQuery.extend(false,{type:opts.ajaxType,data:opts.ajaxData,cache:opts.ajaxCache,url:url,complete:function(XMLHttpRequest,textStatus){if(textStatus=="success"||textStatus=="notmodified"){if(opts.ajaxCache){$(document.body).data("btCache-"+url.replace(/\./g,""),XMLHttpRequest.responseText);}ajaxTimeout=false;content=selector?$("<div/>").append(XMLHttpRequest.responseText.replace(/<script(.|\s)*?\/script>/g,"")).find(selector):XMLHttpRequest.responseText;}else{if(textStatus=="timeout"){ajaxTimeout=true;}content=opts.ajaxError.replace(/%error/g,XMLHttpRequest.statusText);}if($(target).hasClass("bt-active")){target.btOn();}}},opts.ajaxOpts);jQuery.ajax(ajaxOpts);content=opts.ajaxLoading;}}var shadowMarginX=0;var shadowMarginY=0;var shadowShiftX=0;var shadowShiftY=0;if(opts.shadow&&!shadowSupport()){opts.shadow=false;jQuery.extend(opts,opts.noShadowOpts);}if(opts.shadow){if(opts.shadowBlur>Math.abs(opts.shadowOffsetX)){shadowMarginX=opts.shadowBlur*2;}else{shadowMarginX=opts.shadowBlur+Math.abs(opts.shadowOffsetX);}shadowShiftX=(opts.shadowBlur-opts.shadowOffsetX)>0?opts.shadowBlur-opts.shadowOffsetX:0;if(opts.shadowBlur>Math.abs(opts.shadowOffsetY)){shadowMarginY=opts.shadowBlur*2;}else{shadowMarginY=opts.shadowBlur+Math.abs(opts.shadowOffsetY);}shadowShiftY=(opts.shadowBlur-opts.shadowOffsetY)>0?opts.shadowBlur-opts.shadowOffsetY:0;}if(opts.offsetParent){var offsetParent=$(opts.offsetParent);var offsetParentPos=offsetParent.offset();var pos=$(this).offset();var top=numb(pos.top)-numb(offsetParentPos.top)+numb($(this).css("margin-top"))-shadowShiftY;var left=numb(pos.left)-numb(offsetParentPos.left)+numb($(this).css("margin-left"))-shadowShiftX;}else{var offsetParent=($(this).css("position")=="absolute")?$(this).parents().eq(0).offsetParent():$(this).offsetParent();var pos=$(this).btPosition();var top=numb(pos.top)+numb($(this).css("margin-top"))-shadowShiftY;var left=numb(pos.left)+numb($(this).css("margin-left"))-shadowShiftX;}var width=$(this).btOuterWidth();var height=$(this).outerHeight();if(typeof content=="object"){var original=content;var clone=$(original).clone(true).show();var origClones=$(original).data("bt-clones")||[];origClones.push(clone);$(original).data("bt-clones",origClones);$(clone).data("bt-orig",original);$(this).data("bt-content-orig",{original:original,clone:clone});content=clone;}if(typeof content=="null"||content==""){return;}var $text=$('<div class="bt-content"></div>').append(content).css({padding:opts.padding,position:"absolute",width:(opts.shrinkToFit?"auto":opts.width),zIndex:opts.textzIndex,left:shadowShiftX,top:shadowShiftY}).css(opts.cssStyles);var $box=$('<div class="bt-wrapper"></div>').append($text).addClass(opts.cssClass).css({position:"absolute",width:opts.width,zIndex:opts.wrapperzIndex,visibility:"hidden"}).appendTo(offsetParent);if(jQuery.fn.bgiframe){$text.bgiframe();$box.bgiframe();}$(this).data("bt-box",$box);var scrollTop=numb($(document).scrollTop());var scrollLeft=numb($(document).scrollLeft());var docWidth=numb($(window).width());var docHeight=numb($(window).height());var winRight=scrollLeft+docWidth;var winBottom=scrollTop+docHeight;var space=new Object();var thisOffset=$(this).offset();space.top=thisOffset.top-scrollTop;space.bottom=docHeight-((thisOffset+height)-scrollTop);space.left=thisOffset.left-scrollLeft;space.right=docWidth-((thisOffset.left+width)-scrollLeft);var textOutHeight=numb($text.outerHeight());var textOutWidth=numb($text.btOuterWidth());if(opts.positions.constructor==String){opts.positions=opts.positions.replace(/ /,"").split(",");}if(opts.positions[0]=="most"){var position="top";for(var pig in space){position=space[pig]>space[position]?pig:position;}}else{for(var x in opts.positions){var position=opts.positions[x];if((position=="left"||position=="right")&&space[position]>textOutWidth+opts.spikeLength){break;}else{if((position=="top"||position=="bottom")&&space[position]>textOutHeight+opts.spikeLength){break;}}}}var horiz=left+((width-textOutWidth)*0.5);var vert=top+((height-textOutHeight)*0.5);var points=new Array();var textTop,textLeft,textRight,textBottom,textTopSpace,textBottomSpace,textLeftSpace,textRightSpace,crossPoint,textCenter,spikePoint;switch(position){case"top":$text.css("margin-bottom",opts.spikeLength+"px");$box.css({top:(top-$text.outerHeight(true))+opts.overlap,left:horiz});textRightSpace=(winRight-opts.windowMargin)-($text.offset().left+$text.btOuterWidth(true));var xShift=shadowShiftX;if(textRightSpace<0){$box.css("left",(numb($box.css("left"))+textRightSpace)+"px");xShift-=textRightSpace;}textLeftSpace=($text.offset().left+numb($text.css("margin-left")))-(scrollLeft+opts.windowMargin);if(textLeftSpace<0){$box.css("left",(numb($box.css("left"))-textLeftSpace)+"px");xShift+=textLeftSpace;}textTop=$text.btPosition().top+numb($text.css("margin-top"));textLeft=$text.btPosition().left+numb($text.css("margin-left"));textRight=textLeft+$text.btOuterWidth();textBottom=textTop+$text.outerHeight();textCenter={x:textLeft+($text.btOuterWidth()*opts.centerPointX),y:textTop+($text.outerHeight()*opts.centerPointY)};points[points.length]=spikePoint={y:textBottom+opts.spikeLength,x:((textRight-textLeft)*0.5)+xShift,type:"spike"};crossPoint=findIntersectX(spikePoint.x,spikePoint.y,textCenter.x,textCenter.y,textBottom);crossPoint.x=crossPoint.x<textLeft+opts.spikeGirth/2+opts.cornerRadius?textLeft+opts.spikeGirth/2+opts.cornerRadius:crossPoint.x;crossPoint.x=crossPoint.x>(textRight-opts.spikeGirth/2)-opts.cornerRadius?(textRight-opts.spikeGirth/2)-opts.CornerRadius:crossPoint.x;points[points.length]={x:crossPoint.x-(opts.spikeGirth/2),y:textBottom,type:"join"};points[points.length]={x:textLeft,y:textBottom,type:"corner"};points[points.length]={x:textLeft,y:textTop,type:"corner"};points[points.length]={x:textRight,y:textTop,type:"corner"};points[points.length]={x:textRight,y:textBottom,type:"corner"};points[points.length]={x:crossPoint.x+(opts.spikeGirth/2),y:textBottom,type:"join"};points[points.length]=spikePoint;break;case"left":$text.css("margin-right",opts.spikeLength+"px");$box.css({top:vert+"px",left:((left-$text.btOuterWidth(true))+opts.overlap)+"px"});textBottomSpace=(winBottom-opts.windowMargin)-($text.offset().top+$text.outerHeight(true));var yShift=shadowShiftY;if(textBottomSpace<0){$box.css("top",(numb($box.css("top"))+textBottomSpace)+"px");yShift-=textBottomSpace;}textTopSpace=($text.offset().top+numb($text.css("margin-top")))-(scrollTop+opts.windowMargin);if(textTopSpace<0){$box.css("top",(numb($box.css("top"))-textTopSpace)+"px");yShift+=textTopSpace;}textTop=$text.btPosition().top+numb($text.css("margin-top"));textLeft=$text.btPosition().left+numb($text.css("margin-left"));textRight=textLeft+$text.btOuterWidth();textBottom=textTop+$text.outerHeight();textCenter={x:textLeft+($text.btOuterWidth()*opts.centerPointX),y:textTop+($text.outerHeight()*opts.centerPointY)};points[points.length]=spikePoint={x:textRight+opts.spikeLength,y:((textBottom-textTop)*0.5)+yShift,type:"spike"};crossPoint=findIntersectY(spikePoint.x,spikePoint.y,textCenter.x,textCenter.y,textRight);crossPoint.y=crossPoint.y<textTop+opts.spikeGirth/2+opts.cornerRadius?textTop+opts.spikeGirth/2+opts.cornerRadius:crossPoint.y;crossPoint.y=crossPoint.y>(textBottom-opts.spikeGirth/2)-opts.cornerRadius?(textBottom-opts.spikeGirth/2)-opts.cornerRadius:crossPoint.y;points[points.length]={x:textRight,y:crossPoint.y+opts.spikeGirth/2,type:"join"};points[points.length]={x:textRight,y:textBottom,type:"corner"};points[points.length]={x:textLeft,y:textBottom,type:"corner"};points[points.length]={x:textLeft,y:textTop,type:"corner"};points[points.length]={x:textRight,y:textTop,type:"corner"};points[points.length]={x:textRight,y:crossPoint.y-opts.spikeGirth/2,type:"join"};points[points.length]=spikePoint;break;case"bottom":$text.css("margin-top",opts.spikeLength+"px");$box.css({top:(top+height)-opts.overlap,left:horiz});textRightSpace=(winRight-opts.windowMargin)-($text.offset().left+$text.btOuterWidth(true));var xShift=shadowShiftX;if(textRightSpace<0){$box.css("left",(numb($box.css("left"))+textRightSpace)+"px");xShift-=textRightSpace;}textLeftSpace=($text.offset().left+numb($text.css("margin-left")))-(scrollLeft+opts.windowMargin);if(textLeftSpace<0){$box.css("left",(numb($box.css("left"))-textLeftSpace)+"px");xShift+=textLeftSpace;}textTop=$text.btPosition().top+numb($text.css("margin-top"));textLeft=$text.btPosition().left+numb($text.css("margin-left"));textRight=textLeft+$text.btOuterWidth();textBottom=textTop+$text.outerHeight();textCenter={x:textLeft+($text.btOuterWidth()*opts.centerPointX),y:textTop+($text.outerHeight()*opts.centerPointY)};points[points.length]=spikePoint={x:((textRight-textLeft)*0.5)+xShift,y:shadowShiftY,type:"spike"};crossPoint=findIntersectX(spikePoint.x,spikePoint.y,textCenter.x,textCenter.y,textTop);crossPoint.x=crossPoint.x<textLeft+opts.spikeGirth/2+opts.cornerRadius?textLeft+opts.spikeGirth/2+opts.cornerRadius:crossPoint.x;crossPoint.x=crossPoint.x>(textRight-opts.spikeGirth/2)-opts.cornerRadius?(textRight-opts.spikeGirth/2)-opts.cornerRadius:crossPoint.x;points[points.length]={x:crossPoint.x+opts.spikeGirth/2,y:textTop,type:"join"};points[points.length]={x:textRight,y:textTop,type:"corner"};points[points.length]={x:textRight,y:textBottom,type:"corner"};points[points.length]={x:textLeft,y:textBottom,type:"corner"};points[points.length]={x:textLeft,y:textTop,type:"corner"};points[points.length]={x:crossPoint.x-(opts.spikeGirth/2),y:textTop,type:"join"};points[points.length]=spikePoint;break;case"right":$text.css("margin-left",(opts.spikeLength+"px"));$box.css({top:vert+"px",left:((left+width)-opts.overlap)+"px"});textBottomSpace=(winBottom-opts.windowMargin)-($text.offset().top+$text.outerHeight(true));var yShift=shadowShiftY;if(textBottomSpace<0){$box.css("top",(numb($box.css("top"))+textBottomSpace)+"px");yShift-=textBottomSpace;}textTopSpace=($text.offset().top+numb($text.css("margin-top")))-(scrollTop+opts.windowMargin);if(textTopSpace<0){$box.css("top",(numb($box.css("top"))-textTopSpace)+"px");yShift+=textTopSpace;}textTop=$text.btPosition().top+numb($text.css("margin-top"));textLeft=$text.btPosition().left+numb($text.css("margin-left"));textRight=textLeft+$text.btOuterWidth();textBottom=textTop+$text.outerHeight();textCenter={x:textLeft+($text.btOuterWidth()*opts.centerPointX),y:textTop+($text.outerHeight()*opts.centerPointY)};points[points.length]=spikePoint={x:shadowShiftX,y:((textBottom-textTop)*0.5)+yShift,type:"spike"};crossPoint=findIntersectY(spikePoint.x,spikePoint.y,textCenter.x,textCenter.y,textLeft);crossPoint.y=crossPoint.y<textTop+opts.spikeGirth/2+opts.cornerRadius?textTop+opts.spikeGirth/2+opts.cornerRadius:crossPoint.y;crossPoint.y=crossPoint.y>(textBottom-opts.spikeGirth/2)-opts.cornerRadius?(textBottom-opts.spikeGirth/2)-opts.cornerRadius:crossPoint.y;points[points.length]={x:textLeft,y:crossPoint.y-opts.spikeGirth/2,type:"join"};points[points.length]={x:textLeft,y:textTop,type:"corner"};points[points.length]={x:textRight,y:textTop,type:"corner"};points[points.length]={x:textRight,y:textBottom,type:"corner"};points[points.length]={x:textLeft,y:textBottom,type:"corner"};points[points.length]={x:textLeft,y:crossPoint.y+opts.spikeGirth/2,type:"join"};points[points.length]=spikePoint;break;}var canvas=document.createElement("canvas");$(canvas).attr("width",(numb($text.btOuterWidth(true))+opts.strokeWidth*2+shadowMarginX)).attr("height",(numb($text.outerHeight(true))+opts.strokeWidth*2+shadowMarginY)).appendTo($box).css({position:"absolute",zIndex:opts.boxzIndex});if(typeof G_vmlCanvasManager!="undefined"){canvas=G_vmlCanvasManager.initElement(canvas);}if(opts.cornerRadius>0){var newPoints=new Array();var newPoint;for(var i=0;i<points.length;i++){if(points[i].type=="corner"){newPoint=betweenPoint(points[i],points[(i-1)%points.length],opts.cornerRadius);newPoint.type="arcStart";newPoints[newPoints.length]=newPoint;newPoints[newPoints.length]=points[i];newPoint=betweenPoint(points[i],points[(i+1)%points.length],opts.cornerRadius);newPoint.type="arcEnd";newPoints[newPoints.length]=newPoint;}else{newPoints[newPoints.length]=points[i];}}points=newPoints;}var ctx=canvas.getContext("2d");if(opts.shadow&&opts.shadowOverlap!==true){var shadowOverlap=numb(opts.shadowOverlap);switch(position){case"top":if(opts.shadowOffsetX+opts.shadowBlur-shadowOverlap>0){$box.css("top",(numb($box.css("top"))-(opts.shadowOffsetX+opts.shadowBlur-shadowOverlap)));}break;case"right":if(shadowShiftX-shadowOverlap>0){$box.css("left",(numb($box.css("left"))+shadowShiftX-shadowOverlap));}break;case"bottom":if(shadowShiftY-shadowOverlap>0){$box.css("top",(numb($box.css("top"))+shadowShiftY-shadowOverlap));}break;case"left":if(opts.shadowOffsetY+opts.shadowBlur-shadowOverlap>0){$box.css("left",(numb($box.css("left"))-(opts.shadowOffsetY+opts.shadowBlur-shadowOverlap)));}break;}}drawIt.apply(ctx,[points],opts.strokeWidth);ctx.fillStyle=opts.fill;if(opts.shadow){ctx.shadowOffsetX=opts.shadowOffsetX;ctx.shadowOffsetY=opts.shadowOffsetY;ctx.shadowBlur=opts.shadowBlur;ctx.shadowColor=opts.shadowColor;}ctx.closePath();ctx.fill();if(opts.strokeWidth>0){ctx.shadowColor="rgba(0, 0, 0, 0)";ctx.lineWidth=opts.strokeWidth;ctx.strokeStyle=opts.strokeStyle;ctx.beginPath();drawIt.apply(ctx,[points],opts.strokeWidth);ctx.closePath();ctx.stroke();}opts.preShow.apply(this,[$box[0]]);$box.css({display:"none",visibility:"visible"});opts.showTip.apply(this,[$box[0]]);if(opts.overlay){var overlay=$('<div class="bt-overlay"></div>').css({position:"absolute",backgroundColor:"blue",top:top,left:left,width:width,height:height,opacity:".2"}).appendTo(offsetParent);$(this).data("overlay",overlay);}if((opts.ajaxPath!=null&&opts.ajaxCache==false)||ajaxTimeout){content=false;}if(opts.clickAnywhereToClose){jQuery.bt.vars.clickAnywhereStack.push(this);$(document).click(jQuery.bt.docClick);}if(opts.closeWhenOthersOpen){jQuery.bt.vars.closeWhenOpenStack.push(this);}opts.postShow.apply(this,[$box[0]]);};this.btOff=function(){var box=$(this).data("bt-box");opts.preHide.apply(this,[box]);var i=this;i.btCleanup=function(){var box=$(i).data("bt-box");var contentOrig=$(i).data("bt-content-orig");var overlay=$(i).data("bt-overlay");if(typeof box=="object"){$(box).remove();$(i).removeData("bt-box");}if(typeof contentOrig=="object"){var clones=$(contentOrig.original).data("bt-clones");$(contentOrig).data("bt-clones",arrayRemove(clones,contentOrig.clone));}if(typeof overlay=="object"){$(overlay).remove();$(i).removeData("bt-overlay");}jQuery.bt.vars.clickAnywhereStack=arrayRemove(jQuery.bt.vars.clickAnywhereStack,i);jQuery.bt.vars.closeWhenOpenStack=arrayRemove(jQuery.bt.vars.closeWhenOpenStack,i);$(i).removeClass("bt-active "+opts.activeClass);opts.postHide.apply(i);};opts.hideTip.apply(this,[box,i.btCleanup]);};var refresh=this.btRefresh=function(){this.btOff();this.btOn();};});function drawIt(points,strokeWidth){this.moveTo(points[0].x,points[0].y);for(i=1;i<points.length;i++){if(points[i-1].type=="arcStart"){this.quadraticCurveTo(round5(points[i].x,strokeWidth),round5(points[i].y,strokeWidth),round5(points[(i+1)%points.length].x,strokeWidth),round5(points[(i+1)%points.length].y,strokeWidth));i++;}else{this.lineTo(round5(points[i].x,strokeWidth),round5(points[i].y,strokeWidth));}}}function round5(num,strokeWidth){var ret;strokeWidth=numb(strokeWidth);if(strokeWidth%2){ret=num;}else{ret=Math.round(num-0.5)+0.5;}return ret;}function numb(num){return parseInt(num)||0;}function arrayRemove(arr,elem){var x,newArr=new Array();for(x in arr){if(arr[x]!=elem){newArr.push(arr[x]);}}return newArr;}function canvasSupport(){var canvas_compatible=false;try{canvas_compatible=!!(document.createElement("canvas").getContext("2d"));}catch(e){canvas_compatible=!!(document.createElement("canvas").getContext);}return canvas_compatible;}function shadowSupport(){try{var userAgent=navigator.userAgent.toLowerCase();if(/webkit/.test(userAgent)){return true;}else{if(/gecko|mozilla/.test(userAgent)&&parseFloat(userAgent.match(/firefox\/(\d+(?:\.\d+)+)/)[1])>=3.1){return true;}}}catch(err){}return false;}function betweenPoint(point1,point2,dist){var y,x;if(point1.x==point2.x){y=point1.y<point2.y?point1.y+dist:point1.y-dist;return{x:point1.x,y:y};}else{if(point1.y==point2.y){x=point1.x<point2.x?point1.x+dist:point1.x-dist;return{x:x,y:point1.y};}}}function centerPoint(arcStart,corner,arcEnd){var x=corner.x==arcStart.x?arcEnd.x:arcStart.x;var y=corner.y==arcStart.y?arcEnd.y:arcStart.y;var startAngle,endAngle;if(arcStart.x<arcEnd.x){if(arcStart.y>arcEnd.y){startAngle=(Math.PI/180)*180;endAngle=(Math.PI/180)*90;}else{startAngle=(Math.PI/180)*90;endAngle=0;}}else{if(arcStart.y>arcEnd.y){startAngle=(Math.PI/180)*270;endAngle=(Math.PI/180)*180;}else{startAngle=0;endAngle=(Math.PI/180)*270;}}return{x:x,y:y,type:"center",startAngle:startAngle,endAngle:endAngle};}function findIntersect(r1x1,r1y1,r1x2,r1y2,r2x1,r2y1,r2x2,r2y2){if(r2x1==r2x2){return findIntersectY(r1x1,r1y1,r1x2,r1y2,r2x1);}if(r2y1==r2y2){return findIntersectX(r1x1,r1y1,r1x2,r1y2,r2y1);}var r1m=(r1y1-r1y2)/(r1x1-r1x2);var r1b=r1y1-(r1m*r1x1);var r2m=(r2y1-r2y2)/(r2x1-r2x2);var r2b=r2y1-(r2m*r2x1);var x=(r2b-r1b)/(r1m-r2m);var y=r1m*x+r1b;return{x:x,y:y};}function findIntersectY(r1x1,r1y1,r1x2,r1y2,x){if(r1y1==r1y2){return{x:x,y:r1y1};}var r1m=(r1y1-r1y2)/(r1x1-r1x2);var r1b=r1y1-(r1m*r1x1);var y=r1m*x+r1b;return{x:x,y:y};}function findIntersectX(r1x1,r1y1,r1x2,r1y2,y){if(r1x1==r1x2){return{x:r1x1,y:y};}var r1m=(r1y1-r1y2)/(r1x1-r1x2);var r1b=r1y1-(r1m*r1x1);var x=(y-r1b)/r1m;return{x:x,y:y};}};jQuery.fn.btPosition=function(){function num(elem,prop){return elem[0]&&parseInt(jQuery.curCSS(elem[0],prop,true),10)||0;}var left=0,top=0,results;if(this[0]){var offsetParent=this.offsetParent(),offset=this.offset(),parentOffset=/^body|html$/i.test(offsetParent[0].tagName)?{top:0,left:0}:offsetParent.offset();offset.top-=num(this,"marginTop");offset.left-=num(this,"marginLeft");parentOffset.top+=num(offsetParent,"borderTopWidth");parentOffset.left+=num(offsetParent,"borderLeftWidth");results={top:offset.top-parentOffset.top,left:offset.left-parentOffset.left};}return results;};jQuery.fn.btOuterWidth=function(margin){function num(elem,prop){return elem[0]&&parseInt(jQuery.curCSS(elem[0],prop,true),10)||0;}return this["innerWidth"]()+num(this,"borderLeftWidth")+num(this,"borderRightWidth")+(margin?num(this,"marginLeft")+num(this,"marginRight"):0);};jQuery.fn.btOn=function(){return this.each(function(index){if(jQuery.isFunction(this.btOn)){this.btOn();}});};jQuery.fn.btOff=function(){return this.each(function(index){if(jQuery.isFunction(this.btOff)){this.btOff();}});};jQuery.bt.vars={clickAnywhereStack:[],closeWhenOpenStack:[]};jQuery.bt.docClick=function(e){if(!e){var e=window.event;}if(!$(e.target).parents().andSelf().filter(".bt-wrapper, .bt-active").length&&jQuery.bt.vars.clickAnywhereStack.length){$(jQuery.bt.vars.clickAnywhereStack).btOff();$(document).unbind("click",jQuery.bt.docClick);}};jQuery.bt.defaults={trigger:"hover",clickAnywhereToClose:true,closeWhenOthersOpen:false,shrinkToFit:false,width:"200px",padding:"10px",spikeGirth:10,spikeLength:15,overlap:0,overlay:false,killTitle:true,textzIndex:9999,boxzIndex:9998,wrapperzIndex:9997,offsetParent:null,positions:["most"],fill:"rgb(255, 255, 102)",windowMargin:10,strokeWidth:1,strokeStyle:"#000",cornerRadius:5,centerPointX:0.5,centerPointY:0.5,shadow:false,shadowOffsetX:2,shadowOffsetY:2,shadowBlur:3,shadowColor:"#000",shadowOverlap:false,noShadowOpts:{strokeStyle:"#999"},cssClass:"",cssStyles:{},activeClass:"bt-active",contentSelector:"$(this).attr('title')",ajaxPath:null,ajaxError:"<strong>ERROR:</strong> <em>%error</em>",ajaxLoading:"<blink>Loading...</blink>",ajaxData:{},ajaxType:"GET",ajaxCache:true,ajaxOpts:{},preBuild:function(){},preShow:function(box){},showTip:function(box){$(box).show();},postShow:function(box){},preHide:function(box){},hideTip:function(box,callback){$(box).hide();callback();},postHide:function(){},hoverIntentOpts:{interval:300,timeout:500}};jQuery.bt.options={};})(jQuery);
