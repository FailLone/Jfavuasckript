var longestPalindrome = function(s) {
    const length=s.length
    let maxlength=0
    let start
    let P = []
    for(let i=0;i<length;i++)//初始化准备  
    {  
        P[i] = []
        P[i][i]=true
        if(i < length - 1 && s[i]==s[i+1])  
        {  
            P[i][i+1]=true
            start=i
            maxlength=2
        }  
    }  
    for(let len=3;len<=length;len++) {
        for(let i=0;i<=length-len;i++)
        {  
            let j = i+len-1
            if(P[i+1][j-1] && s[i] == s[j])  
            {  
                P[i][j] = true
                maxlength = len
                start = i
            }  
        } 
    } 
    if(maxlength >= 2)  
        return s.substring(start,start + maxlength)
    return s[0] 
}
