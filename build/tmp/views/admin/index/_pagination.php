<?php if ($this->pageCount > 1): ?>

<ul>

    <?php if (isset($this->previous)): ?>
    <!-- Previous page link -->
    <li>
    <a href="<?php echo html_escape($this->url(array('page' => $this->previous), null, $_GET)); ?>">&larr; Previous</a>
    </li>
    <?php endif; ?>

    <!-- Numbered page links -->
    <?php foreach ($this->pagesInRange as $page): ?>
    <?php if ($page != $this->current): ?>
    <li><a href="<?php echo html_escape($this->url(array('page' => $page), null, $_GET)); ?>"><?php echo $page; ?></a></li>
    <?php else: ?>
    <li class="active"><a href="#"><?php echo $page; ?></a></li>
    <?php endif; ?>
    <?php endforeach; ?>

    <?php if (isset($this->next)): ?>
    <!-- Next page link -->
    <li class="next">
    <a href="<?php echo html_escape($this->url(array('page' => $this->next), null, $_GET)); ?>">Next &rarr;</a>
    </li>
    <?php endif; ?>

</ul>

<?php endif; ?>
