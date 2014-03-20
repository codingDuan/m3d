{include file="plaza/top/top_title_config.html.tpl" inline}
{include file="widget/song_list/song_list.html.tpl" inline}
{include file="widget/tree_navigator_top/tree_navigator.html.tpl" inline}
{include file="widget/page_navigator/page_navigator.html.tpl" inline}
{include file="plaza/top/tree_navigator_source.html.tpl" inline}
{include file="widget/top/top_title.html.tpl" inline}

{$type = $tplData.type}
    <div class="main-body module top-list" monkey ="top-{$type}">
			{foreach $titleConfig as $item}
				{if $type == $item@key}
					{$cName = $item.cName}

					{** 标题 **}
					{capture assign=title}
						{top_title titleConfig=$titleConfig type=$type}
					{/capture}
					<div class="head clearfix">
						<h2 class="title">{$title}</h2>
						{if $type != 'artist'}
							{if $tplData.result}
							<span class="play-all">
							{button 
								style = "a"
								str = "播放榜单"
								icon = "play"
								class = "play-all-hook"
								href = "javascript:;"
								tagAtt = "data-type=`$type`"}
							</span>
							{/if}
						{/if}
					</div>
					{if $tplData.result}
					<p class="desc">{$item.info}</p>
					{/if}
				{/if}
			{/foreach}




			{function top_others total = 20}
				{$pageSize = $total}
                {$firstPage = array_slice($tplData.result, 0, $pageSize)}
                {$restPage = array_slice($tplData.result, $pageSize)}
				{if count($firstPage) <10}
					<div class="module-line module-line-bottom"></div>
				{/if}

				{if $type == "hito" || $type == "billboard"  || $type == "chizha" || $type == "ktv" || $type == "chinavoice"  }
					{$src ="mediatop"}
                {elseif $type == "biaosheng" }
                    {$src ="biaosheng"}
				{else}
					{$src ="top"}
				{/if}
				
				{if $type == "yingshijinqu" }
					{$colAlbum = true}
					{$songWidth = $songW-50}
					{$singerWidth = $singerW-140}
				{else}
					{$songWidth = $songW}
					{$singerWidth = $singerW}
					{$colAlbum = false}
				{/if}
				
                <div id="songListWrapper" class="song-list-wrap">
				{song_list colHighRate= true btnPos ="both" colAlbum =$colAlbum topStatusWidth = 30 isSpecial = true total = $total stressFirst = true indexWidth = 30 songData = $firstPage  numPluszero=false singerWidth= $singerWidth  songWidth = $songWidth src =$src funIcon=$funIcon funBtn=$funBtn}
                </div>                
                <div id="restPage" class="rest-page" style="display: none">
                {$rest = count($tplData.result) - $pageSize}
                {$offset = 0}
                {while $rest > 0 }
                    {$pageResult = array_slice($restPage, $offset * $pageSize, $pageSize)}
                    {$pageStart = ($offset + 1) * $pageSize}
                    <textarea style="display:none">{song_list colHighRate= true funIcon=["play","add","download"] btnPos ="both" colAlbum =$colAlbum topStatusWidth = 30 total = $total indexWidth = 30 songData = $pageResult index = $pageStart  numPluszero=false singerWidth= $singerWidth  songWidth = $songWidth src =$src}</textarea>
                    {$rest = $rest - $pageSize}
                    {$offset = $offset + 1}
                {/while}
                </div>
				{page_navigator
				  total = {count($tplData.result)|default:0}
				  size  = $total
				  start = 0
				  url   = "/top/`$type`?start=#start#&size=#size#"}
			{/function}




			{if $tplData.result}
			  {if $type != "artist"}
						<div class="top-list-item">
		                	{top_others total = 50}
						</div>
					
			  {else}
				<div class="module-line module-line-bottom"></div>
				<div class="artist-top">
				  <ul class="artist-head song-list clearfix bb-dotimg">
				  {foreach $tplData.result as $item}
					{if $item.is_new == 1}
						{$status = 'new'}
					{elseif $item.rank_change > 0}
						{$status = 'up'}
					{elseif $item.rank_change < 0}
						{$status = 'down'}
					{elseif $item.rank_change == 0}
						{$status = 'fair'}
					{/if}
					
					{if !$item.del_status}
						{$del = false}
					{else}
						{$del = true}
					{/if}
					<li class="song-item {if $item@first}first{/if}">
					  <span class="index-num">{$item@iteration}</span>
					  <span class="status"><i class="{$status}"></i></span>
					  {if $item@index < $COLUMN}
						<span class="cover-item">
						  <span class="cover-img">
							<a class="over" href="/artist/{$item.ting_uid}">
							  <img src="{$item.avatar_s60|default:#ARTIST_DEFAULT_60s#}" alt="{$item.name}"/>
							</a>
						  </span>
						<div class="artist-name"><a href="/artist/{$item.ting_uid}" title="{$item.name}">{$item.name|pixel_truncate:$TRUNCATE}</a></div>
						</span>
					  {else}
						<span class="artist-name"><a href="/artist/{$item.ting_uid}">{$item.name|pixel_truncate:$TRUNCATE_L}</a></span>
					  {/if}
					</li>
					{if $item@index == $COLUMN-1}
					  </ul><ul class="artist-body song-list clearfix">
					{/if}
					{if $item@iteration > $COLUMN && ($item@iteration - $COLUMN) % $ITEMS == 0}
					  <li class="line-space"></li>
					{/if}
				  {/foreach}
				  </ul>
				</div>
			  {/if}

            {else}
            <p class="desc no-data">非常抱歉，暂无该榜单数据。</p>
            {/if}
    </div>


    <div class="sidebar">        
        <div class="tree_top" monkey="nav-{$type}">
        {tree_navigator_top  treeData=$tree selected=$tplData.type}
        {include file="widget/adm/adm.html.tpl" inline}
        {adm id = "482356" width = "150" height = "220" }
        </div>
    </div>
