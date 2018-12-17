/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var res = {
    HelloWorld_png : "res/bear.png",
    BackGround_png : "res/background.png",
    Start_N_png : "res/start_N.png",
    Start_S_png : "res/start_S.png",
    Sushi_plist : "res/sushi.plist",
    Sushi_png : "res/sushi.png",
    Drw_png : "res/bg.png",
    Font_png : "res/trace_ba_1.png",
    Res_Trace : "res/trace_ba1.txt",
    Res_Luobu : "res/luobu.png",
    Res_BgMusic_Mp3 : "res/bgMusic.mp3",
    Res_Eat_Mp3 : "res/eat.mp3",
    Res_mouse:"res/HitMouse/mole_thump1.png",
    train_header:"res/jointTrain/trainHeader.png",
    train_carriage:"res/jointTrain/train_carriage.png",
    flower_basket:"res/FlowerBasket/basket.png",




};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
