var eGoLStatus = 
{
    Dead           : 0,
    Alive          : 1,
};

function GameOfLife(bridgeworks, sgPointer)
{
    this.bridgeworks = bridgeworks;
    this.sgPointer = sgPointer;
    this.objCountX = 0;
    this.objCountY = 0;
    this.objCountZ = 0;
    this.currGen = null;
    this.nextGen = null
    this.tickIntervalId = null;
}

GameOfLife.prototype.init = function(objCountX,
                                     objCountY,
                                     objCountZ)
{
    if (objCountX <= 0 ||
        objCountY <= 0 ||
        objCountZ <= 0)
        return;
    
    this.objCountX = objCountX;
    this.objCountY = objCountY;
    this.objCountZ = objCountZ;
    
    this.currGen = new Array(objCountX);
    this.nextGen = new Array(objCountX);
    
    var objWidth = 1;
    var objHeight = 1;
    var objDepth = 1;
    
    var seedRate = (1 / (max3(objCountX, objCountY, objCountZ)));
    
    var xml = "<Update>";
    xml += "Set target='NodeMgr' sgPointer='" + this.sgPointer + "'/>";
    // add GoL Models
    for (var i=0, x=0; i < objCountX; i++, x+=objWidth/2)
    {
        this.currGen[i] = new Array(objCountY);
        this.nextGen[i] = new Array(objCountY);
        
        for (var j=0, y=0; j < objCountY; j++, y+=objHeight/2)
        {
            this.currGen[i][j] = new Array(objCountZ);
            this.nextGen[i][j] = new Array(objCountZ);
            
            for (var k=0, z=0; k < objCountZ; k++, z+=objDepth/2)
            {            
                var alive = Math.random() <= seedRate ? true : false;
                this.currGen[i][j][k] = alive ? eGoLStatus.Alive : eGoLStatus.Dead;
                this.nextGen[i][j][k] = eGoLStatus.Dead;
                
                var r = Math.random();
                var g = Math.random();
                var b = Math.random();
                
                xml += "<Cube name='GoL_" + i + "_" + j + "_" + k + "' show='" + alive + "' opacity='1'>";
                xml += "<position x='" + x + "' y='" + y + "' z='" + z + "'/>";
                xml += "<color r='" + r + "' y='" + g + "' z='" + b + "' a='1'/>";
                xml += "</Cube>";
            }
        }
    }

    xml += "</Update>";
    
    this.bridgeworks.updateScene(xml);
}

GameOfLife.prototype.uninit = function()
{
    this.stop();
    
    var xml = "<Update>";
    
    for (var i=0; i < this.objCountX; i++)
    {
        for (var j=0; j < this.objCountY; j++)
        {
            for (var k=0; k < this.objCountZ; k++)
            {
                xml += "<Remove target='GoL_" + i + "_" + j + "_" + k + "'/>";
            }
        }
    }
    
    xml += "</Update>";
    
    this.bridgeworks.updateScene(xml);
}

GameOfLife.prototype.start = function(tickMs)
{
    if (this.tickIntervalId)
    {
        this.stop();
    }
    
    this.tick();
    
    var that = this;
    this.tickIntervalId = 
    setInterval(function () {
        that.tick();
    }, tickMs);
}

GameOfLife.prototype.stop = function()
{
    if (this.tickIntervalId)
    {
        clearInterval(this.tickIntervalId);
        this.tickIntervalId = null;
    }
}

GameOfLife.prototype.tick = function()
{
    var xml = "<Update>";
    
    for (var i=0; i < this.objCountX; i++)
    {     
        for (var j=0; j < this.objCountY; j++)
        {         
            for (var k=0; k < this.objCountZ; k++)
            {
                this.nextGen[i][j][k] = this.currGen[i][j][k];
                
                var liveCount = this.getLiveNeighborCount(i, j, k);
                switch (this.currGen[i][j][k])
                {
                    case eGoLStatus.Dead:
                        {
                            if (liveCount == 3)
                            {
                                this.nextGen[i][j][k] = eGoLStatus.Alive;
                                xml += "<Set target='GoL_" + i + "_" + j + "_" + k + "' show='true'/>";
                            }
                        }
                        break;
                        
                    case eGoLStatus.Alive:
                        {
                            if (liveCount < 2 || liveCount > 3)
                            {
                                this.nextGen[i][j][k] = eGoLStatus.Dead;
                                xml += "<Set target='GoL_" + i + "_" + j + "_" + k + "' show='false'/>";
                            }
                        }
                        break;
                }
            }
        }
    }
    
    xml += "</Update>";
    
    this.bridgeworks.updateScene(xml);
    
    this.currGen = this.nextGen;
}

GameOfLife.prototype.getLiveNeighborCount = function(i, j, k)
{
    var count = 0;
    
    for (var x = -1; x < 2; x++)
    {
        if (x+i < 0 || x+i >= this.objCountX) continue;
        
        for (var y = -1; y < 2; y++)
        {
            if (y+j < 0 || y+j >= this.objCountY) continue;
            
            for (var z = -1; z < 2; z++)
            {
                if (z+k < 0 || z+k >= this.objCountZ) continue;
                if (x == 0 && y == 0 && z == 0) continue; // don't count self
                
                if (this.currGen[x+i][y+j][z+k] == eGoLStatus.Alive)
                {
                    count++;
                    if (count > 3) 
                    {   
                        return count;
                    }
                }
            }
        }
    }
    
    return count;
}